import { CheckCircle2, PencilLine } from 'lucide-react'
import { Badge } from '@components/ui/badge'

export function ArticleStatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  const Icon = published ? CheckCircle2 : PencilLine
  return (
    <Badge variant="outline">
      <Icon
        data-icon="inline-start"
        className={published ? 'text-emerald-500' : 'text-amber-500'}
      />
      {published ? 'опубл.' : 'черновик'}
    </Badge>
  )
}
