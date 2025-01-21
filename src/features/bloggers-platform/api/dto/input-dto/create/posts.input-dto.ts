import { CreatePostDto } from '../../../../application/dto/create/posts.create-dto';

export class CreatePostInputDto implements CreatePostDto {
  blogId: string;
  content: string;
  shortDescription: string;
  title: string;
}
