import { UpdateBlogDto } from '../../../../domain/dto/update/blogs.update-dto';

export class UpdateBlogInputDto implements UpdateBlogDto {
  description: string;
  name: string;
  websiteUrl: string;
}
