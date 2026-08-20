export interface File {
  id: string
  filenameDisk?: string | null
  filenameDownload: string
  title?: string | null
  description?: string | null
  type?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  blurhash?: string | null
}

export interface Category {
  id: string
  name: string
  content?: string | null
  alias: string
  parentId?: string | null
  thumbnailId?: string | null
  thumbnail?: File | null
  collageThumbnails?: File[] | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  ancestors?: Category[]
}

export interface CategoryWithChildren extends Category {
  parent?: Category | null
  children?: CategoryWithChildren[]
  _count?: { articleCategories: number }
}

export interface ArticleCategory {
  id: string
  name: string
  content?: string | null
  alias: string
  parentId?: string | null
  ancestors?: Category[]
}

export interface ArticleListItem {
  id: string
  status: string
  dateCreated: string
  dateUpdated: string | null
  alias: string
  name: string
  content?: string | null
  excerpt?: string | null
  portionCount?: string | null
  cookingTime?: string | null
  calories?: string | null
  protein?: string | null
  fat?: string | null
  carbs?: string | null
  commentsCount: number
  hitsCount: number
  likesCount: number
  categoryId: string
  thumbnailId?: string | null
  category: ArticleCategory
  thumbnail?: File | null
}

export interface ArticleFile {
  id: number
  sort?: number | null
  file?: File | null
}

export interface ArticleDetail extends ArticleListItem {
  ingredients?: { name: string; amount?: string | null; value?: string | null }[] | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
}

export interface Album {
  id: string
  name: string
  alias: string
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  thumbnail?: File | null
  photos?: ArticleFile[]
}

export interface CollectionArticle {
  id: number
  sort?: number | null
  article?: ArticleListItem | null
}

export interface Collection {
  id: string
  name: string
  alias: string
  description?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  thumbnail?: File | null
  articles?: CollectionArticle[]
  _count?: { articles?: number }
}

export interface CommentItem {
  id: string
  status: string
  dateCreated: string
  dateUpdated: string | null
  content?: string | null
  raw?: string | null
  authorName?: string | null
  authorEmail?: string | null
  parentId?: string | null
  parent?: CommentItem | null
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export interface SingleData<T> {
  data: T | null
}
