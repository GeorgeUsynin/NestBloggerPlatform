import { DeletionStatus, User, UserModelType } from '../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserViewDto } from '../api/view-dto/user.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUsersQueryParams } from '../api/query-params-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.view-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return UserViewDto.mapToView(user);
  }

  //TODO: add pagination and filters
  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const filter = {
      $or: [
        { login: { $regex: query.searchLoginTerm, $options: 'i' } },
        { email: { $regex: query.searchEmailTerm, $options: 'i' } },
      ],
    };

    const items = await this.findUserItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredUsers(filter);

    return PaginatedViewDto.mapToView({
      items: items.map((item) => UserViewDto.mapToView(item)),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async findUserItemsByParamsAndFilter(
    query: GetUsersQueryParams,
    filter: any,
  ) {
    const { sortBy, sortDirection, pageSize } = query;
    return this.UserModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredUsers(filter: any) {
    return this.UserModel.countDocuments(filter);
  }
}
