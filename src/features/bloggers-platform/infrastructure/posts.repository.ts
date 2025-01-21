import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeletionStatus,
  Post,
  PostDocument,
  PostModelType,
} from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async findPostByIdOrNotFoundFail(id: string) {
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });
    if (!post) {
      //TODO: replace with domain exception
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async save(post: PostDocument) {
    return post.save();
  }
}
