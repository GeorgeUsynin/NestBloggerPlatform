import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, SchemaTimestampsConfig } from 'mongoose';
import { CreateBlogDto } from './dto/create/blogs.create-dto';
import { UpdateBlogDto } from './dto/update/blogs.update-dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

const pattern =
  '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$';

// The timestamp flag automatically adds the updatedAt and createdAt fields
@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, maxlength: 15, required: true })
  name: string;

  @Prop({ type: String, maxlength: 500, required: true })
  description: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({
    type: String,
    maxlength: 100,
    required: true,
    validate: {
      validator: function (v) {
        return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(
          v,
        );
      },
      message: () => `WebsiteUrl should match the specified ${pattern} pattern`,
    },
  })
  websiteUrl: string;

  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  static createBlog(dto: CreateBlogDto): BlogDocument {
    // BlogDocument!
    const blog = new this(); //this will be a BlogModel when we will call createBlog method!

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog as BlogDocument;
  }

  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateBlogDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

// Registers the entity methods in the schema
BlogSchema.loadClass(Blog);

// Type of the document
export type BlogDocument = HydratedDocument<Blog> & SchemaTimestampsConfig;

// Type of the model + static methods
export type BlogModelType = Model<BlogDocument> & typeof Blog;
