import { SchemaTimestampsConfig } from 'mongoose';
import { PostDocument } from '../../../domain/post.entity';
import { LikeStatus } from '../../../types';

type NewestLikes = {
  addedAt: string;
  userId: string;
  login: string;
};

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: SchemaTimestampsConfig['createdAt'];
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
    newestLikes: NewestLikes[];
  };

  static mapToView(
    post: PostDocument,
    myStatus: LikeStatus,
    newestLikes: NewestLikes[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.shortDescription = post.shortDescription;
    dto.title = post.title;
    dto.extendedLikesInfo = {
      dislikesCount: post.likesInfo.dislikesCount,
      likesCount: post.likesInfo.likesCount,
      myStatus,
      newestLikes,
    };

    return dto;
  }
}
