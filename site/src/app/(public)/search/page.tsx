import { Metadata } from 'next'
import { SearchPage } from '@components/SearchPage'
import { CLIENT_URL } from '@app/utils/config'

export const revalidate = 900

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Поиск',
    alternates: {
      canonical: `${CLIENT_URL}/search`
    }
  }
}

export default function SearchRoute() {
  return <SearchPage query="" />
}
