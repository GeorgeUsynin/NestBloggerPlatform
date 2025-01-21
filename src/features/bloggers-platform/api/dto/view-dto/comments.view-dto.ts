import { SchemaTimestampsConfig } from 'mongoose';
import { LikeStatus } from '../../../types';
import { CommentDocument } from '../../../domain/comment.entity';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: SchemaTimestampsConfig['createdAt'];
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };

  static mapToView(
    comment: CommentDocument,
    myStatus: LikeStatus,
  ): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = comment.commentatorInfo;
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      dislikesCount: comment.likesInfo.dislikesCount,
      likesCount: comment.likesInfo.likesCount,
      myStatus,
    };

    return dto;
  }
}
