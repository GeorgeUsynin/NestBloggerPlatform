import { UpdateCommentDto } from '../../../../domain/dto/update/comments.update-dto';

export class UpdateCommentInputDto implements UpdateCommentDto {
  content: string;
}
