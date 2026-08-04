import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'
import { fetchJson } from '@app/utils/fetchJson'

const { publicRuntimeConfig } = getRuntimeConfig()

export interface GetAvatarArgs {
  id: string
}

export interface GetAvatarData {
  data: string
}

export type GetAvatarResult = [string, (url: string) => Promise<GetAvatarData>]

export function getAvatar ({
  id
}: GetAvatarArgs): GetAvatarResult {
  const key = `${publicRuntimeConfig.API_URL}/custom/comments/${id}/gravatar/`
  const fetcher = url => fetchJson(url)
  return [key, fetcher]
}
