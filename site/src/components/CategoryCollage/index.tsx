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
    'left-[7%] top-[7%] w-[37%] rotate-[-6deg] sm:left-[4%] sm:top-[4%] sm:w-[30%]',
    'left-[57%] top-[9%] w-[32%] rotate-[4deg] sm:left-[52%] sm:top-[5%] sm:w-[25%]',
    'right-[33%] top-[32%] w-[30%] rotate-[-3deg] sm:right-[5%] sm:top-[30%] sm:w-[27%]',
    'left-[10%] top-[42%] w-[24%] rotate-[6deg]',
    'left-[46%] top-[48%] w-[28%] rotate-[-4deg]',
  ],
  [
    'left-[6%] top-[6%] w-[36%] rotate-[5deg] sm:left-[6%] sm:top-[4%] sm:w-[26%]',
    'right-[6%] top-[9%] w-[31%] rotate-[-5deg] sm:right-[6%] sm:top-[5%] sm:w-[30%]',
    'left-[34%] top-[31%] w-[31%] rotate-[2deg] sm:left-[38%] sm:top-[20%] sm:w-[26%]',
    'left-[12%] top-[44%] w-[28%] rotate-[-6deg]',
    'right-[10%] top-[48%] w-[24%] rotate-[4deg]',
  ],
  [
    'left-[8%] top-[7%] w-[37%] rotate-[-4deg] sm:left-[10%] sm:top-[4%] sm:w-[30%]',
    'right-[6%] top-[10%] w-[31%] rotate-[6deg] sm:right-[5%] sm:top-[8%] sm:w-[26%]',
    'left-[34%] top-[33%] w-[31%] rotate-[-7deg] sm:left-[42%] sm:top-[36%] sm:w-[28%]',
    'right-[8%] top-[44%] w-[24%] rotate-[3deg]',
    'left-[7%] top-[56%] w-[22%] rotate-[5deg]',
  ],
  [
    'left-[7%] top-[6%] w-[36%] rotate-[6deg] sm:left-[8%] sm:top-[5%] sm:w-[28%]',
    'right-[6%] top-[9%] w-[31%] rotate-[-4deg] sm:right-[8%] sm:top-[6%] sm:w-[24%]',
    'left-[34%] top-[30%] w-[31%] rotate-[-6deg] sm:left-[44%] sm:top-[16%] sm:w-[30%]',
    'right-[4%] top-[42%] w-[27%] rotate-[5deg]',
    'left-[18%] top-[50%] w-[24%] rotate-[-3deg]',
  ],
  [
    'left-[7%] top-[7%] w-[37%] rotate-[-6deg] sm:left-[8%] sm:top-[5%] sm:w-[30%]',
    'right-[6%] top-[10%] w-[31%] rotate-[5deg] sm:right-[6%] sm:top-[8%] sm:w-[22%]',
    'left-[35%] top-[31%] w-[30%] rotate-[-3deg] sm:left-[46%] sm:top-[18%] sm:w-[26%]',
    'right-[10%] top-[44%] w-[29%] rotate-[6deg]',
    'left-[14%] top-[50%] w-[23%] rotate-[-5deg]',
  ],
  [
    'left-[6%] top-[7%] w-[36%] rotate-[-5deg] sm:left-[4%] sm:top-[5%] sm:w-[26%]',
    'left-[57%] top-[9%] w-[31%] rotate-[4deg] sm:left-[38%] sm:top-[5%] sm:w-[24%]',
    'right-[33%] top-[31%] w-[31%] rotate-[-4deg] sm:right-[5%] sm:top-[12%] sm:w-[28%]',
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
            index > 2 && 'hidden sm:block',
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