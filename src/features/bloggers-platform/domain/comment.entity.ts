import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateCommentDto } from './dto/create/comments.create-dto';
import { UpdateCommentDto } from './dto/update/comments.update-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, minLength: 20, maxLength: 300, required: true })
  content: string;

  @Prop({
    type: {
      userId: { type: String, required: true },
      userLogin: { type: String, required: true },
    },
    required: true,
    _id: false,
  })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({
    type: {
      dislikesCount: Number,
      likesCount: Number,
    },
    default: { dislikesCount: 0, likesCount: 0 }, // Set default object
    _id: false,
  })
  likesInfo: {
    dislikesCount: number;
    likesCount: number;
  };

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createComment(dto: CreateCommentDto): CommentDocument {
    // CommentDocument!
    const comment = new this(); //this will be a CommentModel when we will call createComment method!

    comment.content = dto.content;

    return comment as CommentDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateCommentDto) {
    this.content = dto.content;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Registers the entity methods in the schema
CommentSchema.loadClass(Comment);

// Type of the document
export type CommentDocument = HydratedDocument<Comment> &
  SchemaTimestampsConfig;

// Type of the model + static methods
export type CommentModelType = Model<CommentDocument> & typeof Comment;
