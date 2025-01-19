import { SchemaTimestampsConfig } from 'mongoose';
import { BlogDocument } from '../../../domain/blog.entity';

export class BlogViewDto {
  id: string;
  description: string;
  name: string;
  websiteUrl: string;
  createdAt: SchemaTimestampsConfig['createdAt'];
  isMembership: boolean;

  static mapToView(blog: BlogDocument): BlogViewDto {
    const dto = new BlogViewDto();

    dto.id = blog._id.toString();
    dto.description = blog.description;
    dto.name = blog.name;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt;
    dto.isMembership = blog.isMembership;

    return dto;
  }
}
