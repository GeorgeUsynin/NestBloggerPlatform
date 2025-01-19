import { CreateUserDto } from '../../dto/users.create-dto';

export class CreateUserInputDto implements CreateUserDto {
  login: string;
  password: string;
  email: string;
}

// Можно задействовать класс CreateUserDto, который мы создали ранее,
// для описания параметров application и domain слоев, однако,
// мы разделили эти dto, потому что в дальнейшем в, input-dto,
// могут появиться детали исключительно презентационного слоя (например декораторы swagger)
