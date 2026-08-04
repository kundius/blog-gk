export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** ISO8601 Date values */
  Date: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};



export type Query = {
  __typename?: 'Query';
  tags?: Maybe<Array<Maybe<Tags>>>;
  tags_by_id?: Maybe<Tags>;
  articles_tags?: Maybe<Array<Maybe<Articles_Tags>>>;
  articles_tags_by_id?: Maybe<Articles_Tags>;
  categories?: Maybe<Array<Maybe<Categories>>>;
  categories_by_id?: Maybe<Categories>;
  sections?: Maybe<Array<Maybe<Sections>>>;
  sections_by_id?: Maybe<Sections>;
  articles_directus_files?: Maybe<Array<Maybe<Articles_Directus_Files>>>;
  articles_directus_files_by_id?: Maybe<Articles_Directus_Files>;
  articles?: Maybe<Array<Maybe<Articles>>>;
  articles_by_id?: Maybe<Articles>;
};


export type QueryTagsArgs = {
  filter?: Maybe<Tags_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryTags_By_IdArgs = {
  id: Scalars['ID'];
};


export type QueryArticles_TagsArgs = {
  filter?: Maybe<Articles_Tags_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryArticles_Tags_By_IdArgs = {
  id: Scalars['ID'];
};


export type QueryCategoriesArgs = {
  filter?: Maybe<Categories_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryCategories_By_IdArgs = {
  id: Scalars['ID'];
};


export type QuerySectionsArgs = {
  filter?: Maybe<Sections_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QuerySections_By_IdArgs = {
  id: Scalars['ID'];
};


export type QueryArticles_Directus_FilesArgs = {
  filter?: Maybe<Articles_Directus_Files_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryArticles_Directus_Files_By_IdArgs = {
  id: Scalars['ID'];
};


export type QueryArticlesArgs = {
  filter?: Maybe<Articles_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryArticles_By_IdArgs = {
  id: Scalars['ID'];
};

export type Articles = {
  __typename?: 'articles';
  id?: Maybe<Scalars['ID']>;
  status: Scalars['String'];
  date_created?: Maybe<Scalars['Date']>;
  date_updated?: Maybe<Scalars['Date']>;
  alias: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Directus_Files>;
  seo_title?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  category?: Maybe<Categories>;
  ingredients?: Maybe<Scalars['JSON']>;
  excerpt?: Maybe<Scalars['String']>;
  portion_count?: Maybe<Scalars['String']>;
  cooking_time?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Articles_Tags>>>;
  gallery?: Maybe<Array<Maybe<Articles_Directus_Files>>>;
};


export type ArticlesThumbnailArgs = {
  filter?: Maybe<Directus_Files_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type ArticlesCategoryArgs = {
  filter?: Maybe<Categories_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type ArticlesTagsArgs = {
  filter?: Maybe<Articles_Tags_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type ArticlesGalleryArgs = {
  filter?: Maybe<Articles_Directus_Files_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};

export type Articles_Directus_Files = {
  __typename?: 'articles_directus_files';
  id?: Maybe<Scalars['ID']>;
  articles_id?: Maybe<Articles>;
  directus_files_id?: Maybe<Directus_Files>;
  sort: Scalars['Int'];
};


export type Articles_Directus_FilesArticles_IdArgs = {
  filter?: Maybe<Articles_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type Articles_Directus_FilesDirectus_Files_IdArgs = {
  filter?: Maybe<Directus_Files_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};

export type Articles_Directus_Files_Filter = {
  id?: Maybe<Number_Filter_Operators>;
  articles_id?: Maybe<Articles_Filter>;
  directus_files_id?: Maybe<Directus_Files_Filter>;
  sort?: Maybe<Number_Filter_Operators>;
  _and?: Maybe<Array<Maybe<Articles_Directus_Files_Filter>>>;
  _or?: Maybe<Array<Maybe<Articles_Directus_Files_Filter>>>;
};

export type Articles_Filter = {
  id?: Maybe<String_Filter_Operators>;
  status?: Maybe<String_Filter_Operators>;
  date_created?: Maybe<Date_Filter_Operators>;
  date_updated?: Maybe<Date_Filter_Operators>;
  alias?: Maybe<String_Filter_Operators>;
  content?: Maybe<String_Filter_Operators>;
  thumbnail?: Maybe<Directus_Files_Filter>;
  seo_title?: Maybe<String_Filter_Operators>;
  seo_keywords?: Maybe<String_Filter_Operators>;
  seo_description?: Maybe<String_Filter_Operators>;
  name?: Maybe<String_Filter_Operators>;
  category?: Maybe<Categories_Filter>;
  ingredients?: Maybe<String_Filter_Operators>;
  excerpt?: Maybe<String_Filter_Operators>;
  portion_count?: Maybe<String_Filter_Operators>;
  cooking_time?: Maybe<String_Filter_Operators>;
  tags?: Maybe<Articles_Tags_Filter>;
  gallery?: Maybe<Articles_Directus_Files_Filter>;
  _and?: Maybe<Array<Maybe<Articles_Filter>>>;
  _or?: Maybe<Array<Maybe<Articles_Filter>>>;
};

export type Articles_Tags = {
  __typename?: 'articles_tags';
  id?: Maybe<Scalars['ID']>;
  articles_id?: Maybe<Articles>;
  tags_id?: Maybe<Tags>;
};


export type Articles_TagsArticles_IdArgs = {
  filter?: Maybe<Articles_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type Articles_TagsTags_IdArgs = {
  filter?: Maybe<Tags_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};

export type Articles_Tags_Filter = {
  id?: Maybe<Number_Filter_Operators>;
  articles_id?: Maybe<Articles_Filter>;
  tags_id?: Maybe<Tags_Filter>;
  _and?: Maybe<Array<Maybe<Articles_Tags_Filter>>>;
  _or?: Maybe<Array<Maybe<Articles_Tags_Filter>>>;
};

export type Categories = {
  __typename?: 'categories';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  alias: Scalars['String'];
  seo_title?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_description?: Maybe<Scalars['String']>;
  section?: Maybe<Sections>;
};


export type CategoriesSectionArgs = {
  filter?: Maybe<Sections_Filter>;
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};

export type Categories_Filter = {
  id?: Maybe<String_Filter_Operators>;
  name?: Maybe<String_Filter_Operators>;
  content?: Maybe<String_Filter_Operators>;
  alias?: Maybe<String_Filter_Operators>;
  seo_title?: Maybe<String_Filter_Operators>;
  seo_keywords?: Maybe<String_Filter_Operators>;
  seo_description?: Maybe<String_Filter_Operators>;
  section?: Maybe<Sections_Filter>;
  _and?: Maybe<Array<Maybe<Categories_Filter>>>;
  _or?: Maybe<Array<Maybe<Categories_Filter>>>;
};

export type Date_Filter_Operators = {
  _eq?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _null?: Maybe<Scalars['Boolean']>;
  _nnull?: Maybe<Scalars['Boolean']>;
};

export type Directus_Files = {
  __typename?: 'directus_files';
  id?: Maybe<Scalars['ID']>;
  storage: Scalars['String'];
  filename_disk?: Maybe<Scalars['String']>;
  filename_download: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  folder?: Maybe<Scalars['String']>;
  uploaded_by?: Maybe<Scalars['String']>;
  uploaded_on: Scalars['Date'];
  modified_by?: Maybe<Scalars['String']>;
  modified_on: Scalars['Date'];
  charset?: Maybe<Scalars['String']>;
  filesize?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
  duration?: Maybe<Scalars['Int']>;
  embed?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['JSON']>;
  metadata?: Maybe<Scalars['JSON']>;
};

export type Directus_Files_Filter = {
  id?: Maybe<String_Filter_Operators>;
  storage?: Maybe<String_Filter_Operators>;
  filename_disk?: Maybe<String_Filter_Operators>;
  filename_download?: Maybe<String_Filter_Operators>;
  title?: Maybe<String_Filter_Operators>;
  type?: Maybe<String_Filter_Operators>;
  folder?: Maybe<String_Filter_Operators>;
  uploaded_by?: Maybe<String_Filter_Operators>;
  uploaded_on?: Maybe<Date_Filter_Operators>;
  modified_by?: Maybe<String_Filter_Operators>;
  modified_on?: Maybe<Date_Filter_Operators>;
  charset?: Maybe<String_Filter_Operators>;
  filesize?: Maybe<Number_Filter_Operators>;
  width?: Maybe<Number_Filter_Operators>;
  height?: Maybe<Number_Filter_Operators>;
  duration?: Maybe<Number_Filter_Operators>;
  embed?: Maybe<String_Filter_Operators>;
  description?: Maybe<String_Filter_Operators>;
  location?: Maybe<String_Filter_Operators>;
  tags?: Maybe<String_Filter_Operators>;
  metadata?: Maybe<String_Filter_Operators>;
  _and?: Maybe<Array<Maybe<Directus_Files_Filter>>>;
  _or?: Maybe<Array<Maybe<Directus_Files_Filter>>>;
};

export type Number_Filter_Operators = {
  _eq?: Maybe<Scalars['Float']>;
  _neq?: Maybe<Scalars['Float']>;
  _in?: Maybe<Array<Maybe<Scalars['Float']>>>;
  _nin?: Maybe<Array<Maybe<Scalars['Float']>>>;
  _gt?: Maybe<Scalars['Float']>;
  _gte?: Maybe<Scalars['Float']>;
  _lt?: Maybe<Scalars['Float']>;
  _lte?: Maybe<Scalars['Float']>;
  _null?: Maybe<Scalars['Boolean']>;
  _nnull?: Maybe<Scalars['Boolean']>;
};

export type Sections = {
  __typename?: 'sections';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  content?: Maybe<Scalars['String']>;
  alias: Scalars['String'];
  seo_title?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_description?: Maybe<Scalars['String']>;
};

export type Sections_Filter = {
  id?: Maybe<String_Filter_Operators>;
  name?: Maybe<String_Filter_Operators>;
  content?: Maybe<String_Filter_Operators>;
  alias?: Maybe<String_Filter_Operators>;
  seo_title?: Maybe<String_Filter_Operators>;
  seo_keywords?: Maybe<String_Filter_Operators>;
  seo_description?: Maybe<String_Filter_Operators>;
  _and?: Maybe<Array<Maybe<Sections_Filter>>>;
  _or?: Maybe<Array<Maybe<Sections_Filter>>>;
};

export type String_Filter_Operators = {
  _eq?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _contains?: Maybe<Scalars['String']>;
  _ncontains?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Maybe<Scalars['String']>>>;
  _nin?: Maybe<Array<Maybe<Scalars['String']>>>;
  _null?: Maybe<Scalars['Boolean']>;
  _nnull?: Maybe<Scalars['Boolean']>;
  _empty?: Maybe<Scalars['Boolean']>;
  _nempty?: Maybe<Scalars['Boolean']>;
};

export type Tags = {
  __typename?: 'tags';
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  alias: Scalars['String'];
};

export type Tags_Filter = {
  id?: Maybe<String_Filter_Operators>;
  name?: Maybe<String_Filter_Operators>;
  alias?: Maybe<String_Filter_Operators>;
  _and?: Maybe<Array<Maybe<Tags_Filter>>>;
  _or?: Maybe<Array<Maybe<Tags_Filter>>>;
};
