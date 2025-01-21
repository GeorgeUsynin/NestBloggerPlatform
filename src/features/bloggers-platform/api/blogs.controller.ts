import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GetBlogsQueryParams } from './dto/query-params-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BlogViewDto } from './dto/view-dto/blogs.view-dto';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { CreateBlogInputDto } from './dto/input-dto/create/blogs.input-dto';
import { BlogsService } from '../application/blogs.service';
import { UpdateBlogInputDto } from './dto/input-dto/update/blogs.input-dto';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto copy';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async getAllPostsByBlogId(
    @Query() query: GetPostsQueryParams,
    @Param('id') id: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAllPostsByBlogId(query, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() payload: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(payload);

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogID(
    @Param('id') id: string,
    @Body() payload: Omit<CreatePostInputDto, 'blogId'>,
  ): Promise<PostViewDto> {
    const postId = await this.postsService.createPost({
      ...payload,
      blogId: id,
    });

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlogById(
    @Param('id') id: string,
    @Body() payload: UpdateBlogInputDto,
  ) {
    await this.blogsService.updateBlogById(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlogById(@Param('id') id: string) {
    await this.blogsService.deleteBlogById(id);
  }
}
