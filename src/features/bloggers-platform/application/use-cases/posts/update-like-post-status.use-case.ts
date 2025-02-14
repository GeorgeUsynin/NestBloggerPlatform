import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../../../domain/like.entity';
import { PostsRepository } from '../../../infrastructure/posts.repository';
import { LikesRepository } from '../../../infrastructure/likes.repository';
import { UpdateLikeDto } from '../../../domain/dto/update/likes.update-dto';
import { LikeStatus } from '../../../types';

export class UpdateLikePostStatusCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly dto: UpdateLikeDto,
  ) {}
}

@CommandHandler(UpdateLikePostStatusCommand)
export class UpdateLikePostStatusUseCase
  implements ICommandHandler<UpdateLikePostStatusCommand, void>
{
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute({ postId, userId, dto }: UpdateLikePostStatusCommand) {
    const { likeStatus } = dto;

    const post = await this.postsRepository.findPostByIdOrNotFoundFail(postId);

    const like = await this.likesRepository.findLikeByParams({
      parentId: postId,
      userId,
    });

    /**
     * Scenario where like for the post DOES NOT EXIST!
     */
    if (!like) {
      // Validation for creation the like with `None` status by default
      if (likeStatus === LikeStatus.None) return;

      // Create and save the like
      const newLike = this.LikeModel.createLike({
        parentId: postId,
        userId,
        status: likeStatus,
      });
      await this.likesRepository.save(newLike);

      // Update and save the post
      post.updateLikesInfoCount(likeStatus);
      await this.postsRepository.save(post);

      return;
    }

    /**
     * Scenario where like for the post EXISTS!
     */

    // Avoid update if new status is the same as current one
    if (like.isSameStatus(likeStatus)) return;

    const oldLikeStatus = like.status;

    // Update and save the like
    like.update(dto);
    await this.likesRepository.save(like);

    // Update and save the post likes info
    post.updateLikesInfoCount(likeStatus, oldLikeStatus);
    await this.postsRepository.save(post);
  }
}
