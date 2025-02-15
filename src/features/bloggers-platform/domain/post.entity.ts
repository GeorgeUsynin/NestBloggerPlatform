import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreatePostDto } from './dto/create/posts.create-dto';
import { UpdatePostDto } from './dto/update/posts.update-dto';
import { LikeStatus } from '../types';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

export const titleConstraints = {
  maxLength: 30,
};

export const shortDescriptionConstraints = {
  maxLength: 100,
};

export const contentConstraints = {
  maxLength: 1000,
};

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true, ...titleConstraints })
  title: string;

  @Prop({ type: String, required: true, ...shortDescriptionConstraints })
  shortDescription: string;

  @Prop({
    type: String,
    required: true,
    ...contentConstraints,
  })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

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

  static createPost(dto: CreatePostDto): PostDocument {
    // PostDocument!
    const post = new this(); //this will be a PostModel when we will call createPost method!

    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.content = dto.content;
    post.shortDescription = dto.shortDescription;
    post.title = dto.title;

    return post as PostDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdatePostDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = dto.blogId;
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

export const PostSchema = SchemaFactory.createForClass(Post);

// Registers the entity methods in the schema
PostSchema.loadClass(Post);

// Type of the document
export type PostDocument = HydratedDocument<Post> & SchemaTimestampsConfig;

// Type of the model + static methods
export type PostModelType = Model<PostDocument> & typeof Post;
