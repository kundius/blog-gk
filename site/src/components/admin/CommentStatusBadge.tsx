import { CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@components/ui/badge'

export function CommentStatusBadge({ status }: { status: string }) {
  const published = status === 'published'
  const Icon = published ? CheckCircle2 : Clock
  return (
    <Badge variant="outline">
      <Icon
        data-icon="inline-start"
        className={published ? 'text-emerald-500' : 'text-amber-500'}
      />
      {published ? 'опубл.' : 'на модерации'}
    </Badge>
  )
}
