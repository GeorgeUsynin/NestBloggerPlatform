import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDocument,
  CommentModelType,
  DeletionStatus,
} from '../domain/comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  async findCommentByIdOrNotFoundFail(id: string) {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    if (!comment) {
      //TODO: replace with domain exception
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async save(comment: CommentDocument) {
    return comment.save();
  }
}
