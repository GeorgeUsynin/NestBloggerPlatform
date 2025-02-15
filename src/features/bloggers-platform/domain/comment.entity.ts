import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateCommentDto } from './dto/create/comments.create-dto';
import { UpdateCommentDto } from './dto/update/comments.update-dto';
import { ForbiddenDomainException } from '../../../core/exceptions/domain-exceptions';
import { LikeStatus } from '../types';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const contentConstraints = {
  minLength: 20,
  maxLength: 1000,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true, ...contentConstraints })
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
    comment.commentatorInfo = { userId: dto.userId, userLogin: dto.userLogin };
    comment.postId = dto.postId;

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

  isCommentOwner(userId: string) {
    if (this.commentatorInfo.userId !== userId) {
      throw ForbiddenDomainException.create(
        'You are not allowed to modify this comment',
      );
    }

    return true;
  }

  updateLikesInfoCount(newLikeStatus: LikeStatus, oldLikeStatus?: LikeStatus) {
    if (!oldLikeStatus) {
      if (newLikeStatus === LikeStatus.Like) {
        this.likesInfo.likesCount += 1;
      } else if (newLikeStatus === LikeStatus.Dislike) {
        this.likesInfo.dislikesCount += 1;
      }
    } else {
      switch (oldLikeStatus) {
        case LikeStatus.Like:
          if (newLikeStatus === LikeStatus.Dislike) {
            this.likesInfo.likesCount -= 1;
            this.likesInfo.dislikesCount += 1;
          } else if (newLikeStatus === LikeStatus.None) {
            this.likesInfo.likesCount -= 1;
          }
          break;

        case LikeStatus.Dislike:
          if (newLikeStatus === LikeStatus.Like) {
            this.likesInfo.likesCount += 1;
            this.likesInfo.dislikesCount -= 1;
          } else if (newLikeStatus === LikeStatus.None) {
            this.likesInfo.dislikesCount -= 1;
          }
          break;

        case LikeStatus.None:
          if (newLikeStatus === LikeStatus.Like) {
            this.likesInfo.likesCount += 1;
          } else if (newLikeStatus === LikeStatus.Dislike) {
            this.likesInfo.dislikesCount += 1;
          }
          break;
      }
    }
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
