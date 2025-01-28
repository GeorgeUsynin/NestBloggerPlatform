import { add } from 'date-fns/add';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateUserDto } from './dto/create/users.create-dto';
import { CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS } from '../../../constants';

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

@Schema({ _id: false })
class EmailConfirmation {
  @Prop({ type: Boolean, default: false })
  isConfirmed: boolean;

  @Prop({ type: String, default: null })
  confirmationCode: string | null;

  @Prop({ type: Date, default: null })
  expirationDate: Date | null;
}

@Schema({ _id: false })
class PasswordRecovery {
  @Prop({ type: String, default: null })
  recoveryCode: string | null;

  @Prop({ type: Date, default: null })
  expirationDate: Date | null;
}

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

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: EmailConfirmation, default: {} })
  emailConfirmation: EmailConfirmation;

  @Prop({ type: PasswordRecovery, default: {} })
  passwordRecovery: PasswordRecovery;

  static createUnconfirmedUser(dto: CreateUserDto): UserDocument {
    // UserDocument!
    const user = new this(); //UserModel!
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;

    return user as UserDocument;
  }

  static createConfirmedUser(dto: CreateUserDto): UserDocument {
    // UserDocument!
    const user = new this(); //UserModel!
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;
    user.emailConfirmation.isConfirmed = true;

    return user as UserDocument;
  }

  setConfirmationCode(code: string) {
    if (this.emailConfirmation.isConfirmed) {
      throw new Error('The user has already been confirmed');
    }

    this.emailConfirmation.confirmationCode = code;
    this.emailConfirmation.expirationDate = add(new Date(), {
      hours: CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
    });
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity has already been deleted');
    }

    this.deletionStatus = DeletionStatus.PermanentDeleted;
    this.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Registers the entity methods in the schema
UserSchema.loadClass(User);

// Type of the document
export type UserDocument = HydratedDocument<User> & SchemaTimestampsConfig;

// Type of the model + static methods
export type UserModelType = Model<UserDocument> & typeof User;
