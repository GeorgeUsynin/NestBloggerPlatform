import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { User, UserModelType } from '../user-accounts/domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../bloggers-platform/domain/blog.entity';
import { Post, PostModelType } from '../bloggers-platform/domain/post.entity';
import {
  Comment,
  CommentModelType,
} from '../bloggers-platform/domain/comment.entity';
import { TestingAllDataApi } from './swagger/testing-all-data.decorator';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @TestingAllDataApi()
  async deleteAll() {
    await this.UserModel.deleteMany();
    await this.BlogModel.deleteMany();
    await this.PostModel.deleteMany();
    await this.CommentModel.deleteMany();
  }
}
