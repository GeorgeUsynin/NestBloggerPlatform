import { SchemaTimestampsConfig } from 'mongoose';
import { PostDocument } from '../../../domain/post.entity';
import { LikeStatus } from '../../../types';
import { ApiProperty } from '@nestjs/swagger';

class NewestLikesDto {
  @ApiProperty({ type: String })
  addedAt: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  login: string;
}

class ExtendedLikesInfoDto {
  @ApiProperty({ type: Number })
  likesCount: number;

  @ApiProperty({ type: Number })
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatus,
  })
  myStatus: LikeStatus;

  @ApiProperty({
    type: [NewestLikesDto],
  })
  newestLikes: NewestLikesDto[];
}

export class PostViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: String })
  shortDescription: string;

  @ApiProperty({ type: String })
  content: string;

  @ApiProperty({ type: String })
  blogId: string;

  @ApiProperty({ type: String })
  blogName: string;

  @ApiProperty({ type: Date })
  createdAt: SchemaTimestampsConfig['createdAt'];

  @ApiProperty({ type: ExtendedLikesInfoDto })
  extendedLikesInfo: ExtendedLikesInfoDto;

  static mapToView(
    post: PostDocument,
    myStatus: LikeStatus,
    newestLikes: NewestLikesDto[],
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
