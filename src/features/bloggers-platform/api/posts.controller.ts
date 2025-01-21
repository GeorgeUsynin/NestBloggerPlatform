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

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAllPosts(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  async getAllCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param('id') id: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAllCommentsByPostId(query, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() payload: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(payload);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePostById(
    @Param('id') id: string,
    @Body() payload: UpdatePostInputDto,
  ): Promise<void> {
    await this.postsService.updatePostById(id, payload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePostById(@Param('id') id: string) {
    await this.postsService.deletePostById(id);
  }
}
