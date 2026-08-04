import { AlbumPage } from '@components/AlbumPage'
import { fetchJson } from '@app/utils/fetchJson'
import { getRuntimeConfig } from '@app/utils/getRuntimeConfig'

import * as albumApi from '@components/AlbumPage/api'

const { publicRuntimeConfig } = getRuntimeConfig()

export async function getStaticPaths() {
  const albums = await fetchJson(
    `${publicRuntimeConfig.API_URL}/items/albums?fields=alias`
  )
  const paths = albums.data.map((album) => ({
    params: {
      album: album.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [albumKey, albumFetcher] = albumApi.getAlbum({
    alias: params.album
  })
  const albumData = await albumFetcher(albumKey)

  if (!albumData.data) {
    return {
      notFound: true
    }
  }

  preloadData[albumKey] = albumData

  return {
    props: {
      preloadData,
      alias: params.album
    },
    revalidate: 10
  }
}

export default AlbumPage
