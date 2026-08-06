export interface FileRecord {
  id: string
  filenameDisk?: string | null
  filenameDownload: string
  title?: string | null
  type?: string | null
  width?: number | null
  height?: number | null
  blurhash?: string | null
  createdAt?: string | null
}

export interface CategoryRecord {
  id: string
  name: string
  alias: string
  parentId?: string | null
  content?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  sort?: number | null
  children?: CategoryRecord[]
  _count?: { articles?: number; articleCategories?: number }
}

export interface ArticleRecord {
  id: string
  status: string
  dateCreated?: string | null
  dateUpdated?: string | null
  alias?: string | null
  name: string
  content?: string | null
  excerpt?: string | null
  categoryId: string
  thumbnailId?: string | null
  ingredients?: Array<{ name: string; amount?: string; value?: string }> | null
  portionCount?: string | null
  cookingTime?: string | null
  commentsCount: number
  hitsCount: number
  likesCount: number
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  category?: CategoryRecord
  categories?: Array<{
    id: number
    category?: CategoryRecord | null
    categoryId?: string | null
    sort?: number | null
  }>
  thumbnail?: FileRecord | null
  files?: Array<{ id: number; file?: FileRecord | null; fileId?: string | null }>
}

export interface AlbumRecord {
  id: string
  name: string
  alias: string
  thumbnailId?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  thumbnail?: FileRecord | null
  photos?: Array<{ id: number; file?: FileRecord | null; fileId?: string | null }>
  _count?: { photos: number }
}

export interface CommentRecord {
  id: string
  status: string
  dateCreated?: string | null
  content?: string | null
  raw?: string | null
  authorName?: string | null
  authorEmail?: string | null
  parentId?: string | null
  articleId?: string | null
  parent?: CommentRecord | null
  article?: { id: string; name: string; alias: string } | null
}
