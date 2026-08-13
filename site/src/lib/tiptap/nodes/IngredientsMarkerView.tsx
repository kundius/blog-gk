'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { UtensilsCrossed } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

export function IngredientsMarkerView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper
      className="group relative my-3 rounded-[10px] border border-border bg-muted/40 px-3.5 py-3 text-muted-foreground select-none [.ProseMirror-selectednode_>&]:border-blue-600 [.ProseMirror-selectednode_>&]:shadow-[0_0_0_2px_rgba(59,130,246,0.25)]"
      contentEditable={false}
    >
      <div className="flex w-full items-center gap-3">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-muted text-red-400">
          <UtensilsCrossed className="size-5" />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-sm font-semibold leading-[1.2] text-foreground">
            Ингредиенты
          </div>
          <div className="text-xs leading-[1.2]">
            Блок появится на этом месте в статье
          </div>
        </div>
      </div>
      <BlockToolbar onDelete={deleteNode} />
    </NodeViewWrapper>
  )
}
