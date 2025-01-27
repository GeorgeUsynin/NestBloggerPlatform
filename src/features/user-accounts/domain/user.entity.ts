import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateUserDto } from './dto/create/users.create-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const loginConstraints = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/,
};

export const passwordConstraints = {
  minLength: 6,
  maxLength: 20,
};

export const emailConstraints = {
  match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, ...loginConstraints })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true, ...emailConstraints })
  email: string;

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createUser(dto: CreateUserDto): UserDocument {
    // UserDocument!
    const user = new this(); //UserModel!
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;

    return user as UserDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Registers the entity methods in the schema
UserSchema.loadClass(User);

// Type of the document
export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

// Type of the model + static methods
export type UserModelType = Model<UserDocument> & typeof User;
