import { CreateUserDto } from '../../../../domain/dto/create/users.create-dto';

export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}

// We can utilize the CreateUserDto class, which we created earlier,
// to describe the parameters of the application and domain layers. However,
// we have separated these DTOs because, in the future, the input-dto
// might include details exclusive to the presentation layer (for example, Swagger decorators).
