import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comments.view-dto';
import { GetCommentApi } from './swagger';

@Controller('comments')
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetCommentApi()
  async getCommentById(@Param('id') id: string): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }
}
