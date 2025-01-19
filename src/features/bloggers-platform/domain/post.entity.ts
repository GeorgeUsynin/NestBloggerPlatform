import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreatePostDto } from './dto/create/posts.create-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, maxlength: 30, required: true })
  title: string;

  @Prop({ type: String, maxlength: 100, required: true })
  shortDescription: string;

  @Prop({ type: String, maxlength: 1000, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

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
}

export const PostSchema = SchemaFactory.createForClass(Post);

// Registers the entity methods in the schema
PostSchema.loadClass(Post);

// Type of the document
export type PostDocument = HydratedDocument<Post> & SchemaTimestampsConfig;

// Type of the model + static methods
export type PostModelType = Model<PostDocument> & typeof Post;
