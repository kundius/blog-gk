import { AlbumPage } from '@components/AlbumPage'
import { albumByAlias, listAlbums } from '@app/api/albums'

export async function getStaticPaths() {
  const [key, fetcher] = listAlbums({ limit: 1000 })
  const result = await fetcher(key)
  const paths = (result.data || []).map((album) => ({
    params: {
      album: album.alias
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const preloadData = {}

  const [albumKey, albumFetcher] = albumByAlias(params.album)
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
