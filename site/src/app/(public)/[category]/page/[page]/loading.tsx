import { Container } from '@components/Container'
import { Spinner } from '@components/Spinner'

export default function Loading() {
  return (
    <Container className="mt-12 mb-16 md:mt-16 md:mb-24">
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner className="h-24 w-24 text-[#d36d6d]" />
      </div>
    </Container>
  )
}
