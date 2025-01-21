import { DeletionStatus, Post, PostModelType } from '../domain/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../api/dto/view-dto/comments.view-dto';
import { GetCommentsQueryParams } from '../api/dto/query-params-dto/get-comments-query-params.input-dto';
import { FilterQuery } from 'mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { LikeStatus } from '../types';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
  ) {}

  async getAllCommentsByPostId(
    query: GetCommentsQueryParams,
    postId: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const post = await this.PostModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const filter: FilterQuery<Comment> = {
      postId,
      deletionStatus: { $ne: DeletionStatus.PermanentDeleted },
    };

    const items = await this.findCommentItemsByParamsAndFilter(query, filter);
    const totalCount = await this.getTotalCountOfFilteredComments(filter);

    return PaginatedViewDto.mapToView({
      items: items.map((item) =>
        CommentViewDto.mapToView(item, LikeStatus.None),
      ),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    }).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return CommentViewDto.mapToView(comment, LikeStatus.None);
  }

  async findCommentItemsByParamsAndFilter(
    query: GetCommentsQueryParams,
    filter: FilterQuery<Comment>,
  ) {
    const { sortBy, sortDirection, pageSize } = query;

    return this.CommentModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(query.calculateSkip())
      .limit(pageSize);
  }

  async getTotalCountOfFilteredComments(filter: FilterQuery<Comment>) {
    return this.CommentModel.countDocuments(filter);
  }
}
