import { UpdatePostDto } from '../../../../domain/dto/update/posts.update-dto';

export class UpdatePostInputDto implements UpdatePostDto {
  blogId: string;
  content: string;
  shortDescription: string;
  title: string;
}
