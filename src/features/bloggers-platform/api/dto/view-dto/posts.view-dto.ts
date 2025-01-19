import { SchemaTimestampsConfig } from 'mongoose';
import { PostDocument } from '../../../domain/post.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: SchemaTimestampsConfig['createdAt'];

  static mapToView(post: PostDocument): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.content = post.content;
    dto.createdAt = post.createdAt;
    dto.shortDescription = post.shortDescription;
    dto.title = post.title;

    return dto;
  }
}
