'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { UtensilsCrossed } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

export function IngredientsMarkerView({ deleteNode }: NodeViewProps) {
  return (
    <NodeViewWrapper
      className="ingredients-marker"
      contentEditable={false}
    >
      <div className="ingredients-marker__icon">
        <UtensilsCrossed />
      </div>
      <div className="ingredients-marker__text">
        <div className="ingredients-marker__title">Ингредиенты</div>
        <div className="ingredients-marker__hint">
          Блок появится на этом месте в статье
        </div>
      </div>
      <BlockToolbar
        onDelete={deleteNode}
        visibleClassName="ingredients-marker__toolbar"
      />
    </NodeViewWrapper>
  )
}
