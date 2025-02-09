import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { ObjectIdValidationPipe } from '../../../core/pipes/objectId-validation-pipe';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { GetCommentApi } from './swagger';
import { JwtAuthGuard } from '../../user-accounts/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../user-accounts/guards/decorators/params/ExtractUserFromRequest.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { UpdateCommentInputDto } from './dto/input-dto/update/comments.input-dto';
import {
  DeleteCommentCommand,
  UpdateCommentCommand,
} from '../application/use-cases';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetCommentApi()
  async getCommentById(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // TODO: add swagger
  async updateCommentById(
    @Param('id', ObjectIdValidationPipe) commentId: string,
    @Body() payload: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand(commentId, user.id, payload),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // TODO: add swagger
  async deleteCommentById(
    @Param('id', ObjectIdValidationPipe) commentId: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteCommentCommand(commentId, user.id),
    );
  }
}
