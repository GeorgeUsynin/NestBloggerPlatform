import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { BlogsQueryRepository } from './infrastructure/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blog.entity';
import { BlogsRepository } from './infrastructure/blogs.repository';

@Module({
  // This will allow injecting models into the providers in this module
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    PostsService,
    BlogsRepository,
    BlogsQueryRepository,
  ],
})
export class BloggersPlatformModule {}
