import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { CommentsRepository } from '../../../infrastructure/comments.repository';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeDto } from '../../../domain/dto/update/likes.update-dto';
import { LikeStatus } from '../../../types';

export class UpdateLikeCommentStatusCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly dto: UpdateLikeDto,
  ) {}
}

@CommandHandler(UpdateLikeCommentStatusCommand)
export class UpdateLikeCommentStatusUseCase
  implements ICommandHandler<UpdateLikeCommentStatusCommand, void>
{
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({ commentId, userId, dto }: UpdateLikeCommentStatusCommand) {
    const { likeStatus } = dto;

    const comment =
      await this.commentsRepository.findCommentByIdOrNotFoundFail(commentId);

    const like = await this.likesRepository.findLikeByParams({
      parentId: commentId,
      userId,
    });

    /**
     * Scenario where like for the comment DOES NOT EXIST!
     */
    if (!like) {
      // Validation for creation the like with `None` status by default
      if (likeStatus === LikeStatus.None) return;

      // Create and save the like
      const newLike = this.LikeModel.createLike({
        parentId: commentId,
        userId,
        status: likeStatus,
      });
      await this.likesRepository.save(newLike);

      // Update and save the comment
      comment.updateLikesInfoCount(likeStatus);
      await this.commentsRepository.save(comment);

      return;
    }

    /**
     * Scenario where like for the comment EXISTS!
     */

    // Avoid update if new status is the same as current one
    if (like.isSameStatus(likeStatus)) return;

    const oldLikeStatus = like.status;

    // Update and save the like
    like.update(dto);
    await this.likesRepository.save(like);

    // Update and save the comment likes info
    comment.updateLikesInfoCount(likeStatus, oldLikeStatus);
    await this.commentsRepository.save(comment);
  }
}
