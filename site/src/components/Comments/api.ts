import { listComments, createComment } from '@app/api/comments'
import type { CommentItem } from '@app/api/types'

export interface GetCommentsArgs {
  threadId: string
  threadType: string
}

export interface GetCommentsData {
  data: CommentItem[]
}

export type GetCommentsResult = [string, (url: string) => Promise<GetCommentsData>]

export function getComments ({
  threadId
}: GetCommentsArgs): GetCommentsResult {
  return listComments({
    articleId: threadId,
    status: 'published',
    limit: 1000
  }) as GetCommentsResult
}

export interface CreateCommentArgs {
  threadId: string
  threadType: string
  content: string
  parentId?: string
  authorName?: string
  authorEmail?: string
}

export async function createNewComment ({
  threadId,
  content,
  parentId,
  authorName,
  authorEmail
}: CreateCommentArgs): Promise<any> {
  return createComment({
    articleId: threadId,
    parentId,
    content,
    authorName,
    authorEmail
  })
}
