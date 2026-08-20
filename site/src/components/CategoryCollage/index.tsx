import { cn } from '@app/lib/utils'
import { fileUrl } from '@app/api/images'
import type { File } from '@app/api/types'
import { CoverImage } from '@components/CoverImage'

interface CategoryCollageProps {
  files: File[]
  variant?: number
  className?: string
}

const VARIANTS: string[][] = [
  [
    'left-[4%] top-[4%] w-[30%] rotate-[-6deg]',
    'left-[52%] top-[5%] w-[25%] rotate-[4deg]',
    'right-[5%] top-[30%] w-[27%] rotate-[-3deg]',
    'left-[10%] top-[42%] w-[24%] rotate-[6deg]',
    'left-[46%] top-[48%] w-[28%] rotate-[-4deg]',
  ],
  [
    'left-[6%] top-[4%] w-[26%] rotate-[5deg]',
    'right-[6%] top-[5%] w-[30%] rotate-[-5deg]',
    'left-[38%] top-[20%] w-[26%] rotate-[2deg]',
    'left-[12%] top-[44%] w-[28%] rotate-[-6deg]',
    'right-[10%] top-[48%] w-[24%] rotate-[4deg]',
  ],
  [
    'left-[10%] top-[4%] w-[30%] rotate-[-4deg]',
    'right-[5%] top-[8%] w-[26%] rotate-[6deg]',
    'left-[42%] top-[36%] w-[28%] rotate-[-7deg]',
    'right-[8%] top-[44%] w-[24%] rotate-[3deg]',
    'left-[7%] top-[56%] w-[22%] rotate-[5deg]',
  ],
  [
    'left-[8%] top-[5%] w-[28%] rotate-[6deg]',
    'right-[8%] top-[6%] w-[24%] rotate-[-4deg]',
    'left-[44%] top-[16%] w-[30%] rotate-[-6deg]',
    'right-[4%] top-[42%] w-[27%] rotate-[5deg]',
    'left-[18%] top-[50%] w-[24%] rotate-[-3deg]',
  ],
  [
    'left-[8%] top-[5%] w-[30%] rotate-[-6deg]',
    'right-[6%] top-[8%] w-[22%] rotate-[5deg]',
    'left-[46%] top-[18%] w-[26%] rotate-[-3deg]',
    'right-[10%] top-[44%] w-[29%] rotate-[6deg]',
    'left-[14%] top-[50%] w-[23%] rotate-[-5deg]',
  ],
  [
    'left-[4%] top-[5%] w-[26%] rotate-[-5deg]',
    'left-[38%] top-[5%] w-[24%] rotate-[4deg]',
    'right-[5%] top-[12%] w-[28%] rotate-[-4deg]',
    'left-[46%] top-[44%] w-[26%] rotate-[6deg]',
    'left-[10%] top-[52%] w-[27%] rotate-[-6deg]',
  ],
]

export function CategoryCollage({
  files,
  variant = 0,
  className,
}: CategoryCollageProps) {
  const background = files[0]
  const stamps = files.slice(1, 6)

  if (!background) {
    return <div className={cn('h-full w-full bg-muted', className)} />
  }

  const positions = VARIANTS[((variant % VARIANTS.length) + VARIANTS.length) % VARIANTS.length]

  return (
    <div className={cn('relative h-full w-full', className)} suppressHydrationWarning>
      <div className="absolute inset-0 overflow-hidden">
        <CoverImage
          src={fileUrl(background) ?? ''}
          alt={background.title || 'Обложка категории'}
          blurHash={background.blurhash}
          className="scale-105 blur-[4px] brightness-[0.8] transition-all duration-600 ease-out group-hover:scale-115"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      </div>
      {stamps.map((file, index) => (
        <div
          key={file.id}
          className={cn(
            'absolute overflow-hidden bg-white/70 p-[2.5px] sm:p-[5px] shadow-[0_12px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-600 ease-out group-hover:scale-105 group-hover:shadow-[0_14px_28px_rgba(0,0,0,0.55)]',
            positions?.[index]
          )}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
            <CoverImage
              src={fileUrl(file) ?? ''}
              alt={file.title || 'Обложка категории'}
              blurHash={file.blurhash}
              sizes="160px"
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
  )
}