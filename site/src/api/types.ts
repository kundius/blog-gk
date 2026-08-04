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
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
}

export interface CategoryWithChildren extends Category {
  parent?: Category | null
  children?: CategoryWithChildren[]
  _count?: { articles: number }
}

export interface ArticleCategory {
  id: string
  name: string
  content?: string | null
  alias: string
  parentId?: string | null
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
  commentsCount: number
  hitsCount: number
  likesCount: number
  categoryId: string
  thumbnailId?: string | null
  category: ArticleCategory
  thumbnail?: File | null
}

export interface ArticleTag {
  id: number
  tag: {
    id: string
    name: string
    alias: string
  }
}

export interface ArticleFile {
  id: number
  sort?: number | null
  file?: File | null
}

export interface ArticleDetail extends ArticleListItem {
  ingredients?: { name: string; amount: string }[] | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
  tags: ArticleTag[]
  files: ArticleFile[]
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

export interface Page {
  id: string
  name: string
  alias: string
  content?: string | null
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
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
