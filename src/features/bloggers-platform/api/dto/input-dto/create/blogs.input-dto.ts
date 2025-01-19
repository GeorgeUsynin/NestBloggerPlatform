import { CreateBlogDto } from '../../../../domain/dto/create/blogs.create-dto';

export class CreateBlogInputDto implements CreateBlogDto {
  description: string;
  name: string;
  websiteUrl: string;
}
