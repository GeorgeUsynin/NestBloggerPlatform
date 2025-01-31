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
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto copy';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import { PostsService } from '../application/posts.service';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import {
  CreatePostApi,
  GetAllPostsApi,
  GetPostApi,
  UpdatePostApi,
  DeletePostApi,
  GetAllCommentsByPostIdApi,
} from './swagger';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllPostsApi()
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAllPosts(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetPostApi()
  async getPostById(@Param('id') id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param('postId') postId: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAllCommentsByPostId(query, postId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePostApi()
  async createPost(@Body() payload: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(payload);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id') id: string,
    @Body() payload: UpdatePostInputDto,
  ): Promise<void> {
    await this.postsService.updatePostById(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeletePostApi()
  async deletePostById(@Param('id') id: string) {
    await this.postsService.deletePostById(id);
  }
}
