import { CreatePostDto } from '../../../../domain/dto/create/posts.create-dto';

export class CreatePostInputDto implements CreatePostDto {
  blogId: string;
  blogName: string;
  content: string;
  shortDescription: string;
  title: string;
}
