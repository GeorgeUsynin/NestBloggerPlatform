import { Module } from '@nestjs/common';
import { UsersAccountsModule } from '../user-accounts/usersAccounts.module';
import { BlogsController } from './api/blogs.controller';
import { PostsController } from './api/posts.controller';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsQueryRepository } from './infrastructure/posts.query-repository';
import { CommentsController } from './api/comments.controller';
import { CommentsQueryRepository } from './infrastructure/comments.query-repository';
import { Post, PostSchema } from './domain/post.entity';
import { Comment, CommentSchema } from './domain/comment.entity';
import { PostsRepository } from './infrastructure/posts.repository';
import { CommentsRepository } from './infrastructure/comments.repository';
import {
  CreateBlogUseCase,
  CreatePostUseCase,
  DeleteBlogUseCase,
  DeletePostUseCase,
  UpdateBlogUseCase,
  UpdatePostUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
} from './application/use-cases';

const useCases = [
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];
const repositories = [BlogsRepository, PostsRepository, CommentsRepository];
const queryRepositories = [
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];

@Module({
  // This will allow injecting models into the providers in this module
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UsersAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [...repositories, ...queryRepositories, ...useCases],
  exports: [MongooseModule],
  /* We re-export the MongooseModule if we want the models registered here to be injectable 
  into the services of other modules that import this module */
})
export class BloggersPlatformModule {}
