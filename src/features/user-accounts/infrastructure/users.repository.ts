import { InjectModel } from '@nestjs/mongoose';
import {
  DeletionStatus,
  User,
  UserDocument,
  UserModelType,
} from '../domain/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

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
      //TODO: replace with domain exception
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async save(user: UserDocument) {
    await user.save();
  }
}
