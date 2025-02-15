import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../../../domain/post.entity';
import {
  MaxLengthWithMessage,
  IsStringWithTrim,
} from '../../../../../../core/decorators/validation';
import { CreatePostDto } from '../../../../application/dto/create/posts.create-dto';

export class CreatePostInputDto implements CreatePostDto {
  @MaxLengthWithMessage(titleConstraints.maxLength)
  @IsStringWithTrim()
  title: string;

  @MaxLengthWithMessage(shortDescriptionConstraints.maxLength)
  @IsStringWithTrim()
  shortDescription: string;

  @MaxLengthWithMessage(contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;

  // TODO: Create custom blogId validator: https://github.com/typestack/class-validator?tab=readme-ov-file#custom-validation-decorators
  @IsStringWithTrim()
  blogId: string;
}
