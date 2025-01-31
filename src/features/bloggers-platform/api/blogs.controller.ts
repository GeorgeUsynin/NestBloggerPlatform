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
import { GetAllBlogsApi } from './swagger/get-all-blogs.decorator';
import { GetBlogApi } from './swagger/get-blog.decorator';
import { GetAllPostsApi } from './swagger/get-all-posts.decorator';
import { CreateBlogApi } from './swagger/create-blog.decorator';
import { CreatePostByBlogIdApi } from './swagger/create-post-by-blogId.decorator';
import { UpdateBlogApi } from './swagger/update-blog.decorator';
import { DeleteBlogApi } from './swagger/delete-blog.decorator';

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
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetBlogApi()
  async getBlogById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':blogId/posts')
  @HttpCode(HttpStatus.OK)
  @GetAllPostsApi()
  async getAllPostsByBlogId(
    @Query() query: GetPostsQueryParams,
    @Param('blogId') blogId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAllPostsByBlogId(query, blogId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBlogApi()
  async createBlog(@Body() payload: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(payload);

    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Post(':id/posts')
  @HttpCode(HttpStatus.CREATED)
  @CreatePostByBlogIdApi()
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
  @UpdateBlogApi()
  async updateBlogById(
    @Param('id') id: string,
    @Body() payload: UpdateBlogInputDto,
  ) {
    await this.blogsService.updateBlogById(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteBlogApi()
  async deleteBlogById(@Param('id') id: string) {
    await this.blogsService.deleteBlogById(id);
  }
}
