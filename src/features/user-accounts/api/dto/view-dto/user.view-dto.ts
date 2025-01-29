import { SchemaTimestampsConfig } from 'mongoose';
import { UserDocument } from '../../../domain/user.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';

export class UserViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: SchemaTimestampsConfig['createdAt'];

  static mapToView(user: UserDocument): UserViewDto {
    const dto = new UserViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.id = user._id.toString();
    dto.createdAt = user.createdAt;

    return dto;
  }
}

export class PaginatedUsersViewDto extends PaginatedViewDto<UserViewDto[]> {
  @ApiProperty({ type: [UserViewDto] })
  items: UserViewDto[];
}

export class MeViewDto extends OmitType(UserViewDto, [
  'createdAt',
  'id',
] as const) {
  userId: string;

  static mapToView(user: UserDocument): MeViewDto {
    const dto = new MeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user._id.toString();

    return dto;
  }
}
