import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { CreatePostDto } from '../application/dto/create/posts.create-dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { UpdatePostDto } from '../domain/dto/update/posts.update-dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(
      dto.blogId,
    );

    const newPost = this.PostModel.createPost({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(newPost);

    return newPost._id.toString();
  }

  async updatePostById(id: string, dto: UpdatePostDto) {
    const post = await this.postsRepository.findPostByIdOrNotFoundFail(id);

    // don't assign properties directly to entities in services! even for changing a single property
    // create a method instead
    post.update(dto); // change detection

    await this.postsRepository.save(post);
  }

  async deletePostById(id: string) {
    const post = await this.postsRepository.findPostByIdOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
