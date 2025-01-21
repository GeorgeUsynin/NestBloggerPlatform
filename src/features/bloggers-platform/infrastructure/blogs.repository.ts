import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Blog,
  BlogDocument,
  BlogModelType,
  DeletionStatus,
} from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async findBlogByIdOrNotFoundFail(id: string) {
    const blog = await this.BlogModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
    if (!blog) {
      //TODO: replace with domain exception
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async save(blog: BlogDocument) {
    return blog.save();
  }
}
