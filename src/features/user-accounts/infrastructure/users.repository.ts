import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable } from '@nestjs/common';
import { NotFoundDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersRepository {
  // Injection of the model through DI
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findUserByIdOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    });

    if (!user) {
      throw NotFoundDomainException.create('User not found');
    }

    return user;
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }
}
