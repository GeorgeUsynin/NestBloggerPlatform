import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { CreateBlogDto } from '../domain/dto/create/blogs.create-dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { UpdateBlogDto } from '../domain/dto/update/blogs.update-dto';

@Injectable()
export class BlogsService {
  constructor(
    // Injection of the model into the service through DI
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const newBlog = this.BlogModel.createBlog(dto);

    await this.blogsRepository.save(newBlog);

    return newBlog._id.toString();
  }

  async updateBlogById(id: string, dto: UpdateBlogDto) {
    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(id);

    // не присваиваем св-ва сущностям напрямую в сервисах! даже для изменения одного св-ва
    // создаём метод
    blog.update(dto); // change detection

    await this.blogsRepository.save(blog);
  }

  async deleteBlogById(id: string) {
    const blog = await this.blogsRepository.findBlogByIdOrNotFoundFail(id);

    blog.makeDeleted();

    await this.blogsRepository.save(blog);
  }
}
