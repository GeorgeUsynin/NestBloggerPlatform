import { DeletionStatus, Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../api/dto/view-dto/posts.view-dto';
import { FilterQuery } from 'mongoose';
import { Blog } from '../domain/blog.entity';
import { BlogModelType } from '../domain/blog.entity';
import { GetPostsQueryParams } from '../api/dto/query-params-dto/get-posts-query-params.input-dto copy';
import { LikeStatus } from '../types';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParams,
    blogId?: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletionStatus: DeletionStatus.NotDeleted,
      ...(blogId && { blogId }),
    };

    const items = await this.findPostItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredPosts(filter);

    return PaginatedViewDto.mapToView({
      items: items.map((item) =>
        PostViewDto.mapToView(item, LikeStatus.None, []),
      ),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getAllPostsByBlogId(
    query: GetPostsQueryParams,
    blogId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const blog = await this.BlogModel.findById(blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return this.getAllPosts(query, blogId);
  }

  async getByIdOrNotFoundFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return PostViewDto.mapToView(post, LikeStatus.None, []);
  }

  async findPostItemsByParamsAndFilter(
    query: GetPostsQueryParams,
    filter: FilterQuery<Post>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;

    return this.PostModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredPosts(filter: FilterQuery<Post>) {
    return this.PostModel.countDocuments(filter);
  }
}
