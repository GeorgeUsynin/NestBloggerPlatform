import { CreateUserDto } from '../../dto/users.create-dto';

export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}
