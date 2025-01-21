import { CreateCommentDto } from '../../../../domain/dto/create/comments.create-dto';

export class CreateCommentInputDto implements CreateCommentDto {
  content: string;
}
