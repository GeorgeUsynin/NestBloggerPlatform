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
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PostViewDto } from './dto/view-dto/posts.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { CreatePostInputDto } from './dto/input-dto/create/posts.input-dto';
import { GetPostsQueryParams } from './dto/query-params-dto/get-posts-query-params.input-dto copy';
import { GetCommentsQueryParams } from './dto/query-params-dto/get-comments-query-params.input-dto';
import { UpdatePostInputDto } from './dto/input-dto/update/posts.input-dto';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { CreateCommentInputDto } from './dto/input-dto/create/comments.input-dto';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import {
  CreatePostApi,
  GetAllPostsApi,
  GetPostApi,
  UpdatePostApi,
  DeletePostApi,
  GetAllCommentsByPostIdApi,
} from './swagger';
import {
  CreatePostCommand,
  UpdatePostCommand,
  DeletePostCommand,
  CreateCommentCommand,
} from '../application/use-cases';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
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
  async getPostById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Query() query: GetCommentsQueryParams,
    @Param('postId', ObjectIdValidationPipe) postId: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAllCommentsByPostId(query, postId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePostApi()
  async createPost(@Body() payload: CreatePostInputDto): Promise<PostViewDto> {
    const postId = await this.commandBus.execute(
      new CreatePostCommand(payload),
    );

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  // TODO: add swagger
  async createCommentByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() payload: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand({
        content: payload.content,
        postId,
        userId: user.id,
      }),
    );

    return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() payload: UpdatePostInputDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdatePostCommand(id, payload));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeletePostApi()
  async deletePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    return this.commandBus.execute(new DeletePostCommand(id));
  }
}
