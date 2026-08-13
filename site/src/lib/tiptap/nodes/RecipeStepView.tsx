'use client'

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { BetweenVerticalEnd, BetweenVerticalStart } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

const TOOLBAR_VISIBILITY =
  'group-hover/step:visible group-hover/step:opacity-100'

export function RecipeStepView({ deleteNode, editor, getPos }: NodeViewProps) {
  const addStep = (where: 'above' | 'below') => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    const stepNode = $pos.nodeAfter
    if (!stepNode) return
    const insertAt = where === 'above' ? pos : pos + stepNode.nodeSize
    const newStep = state.schema.nodes.recipeStep.create(null, state.schema.nodes.paragraph.create())
    const tr = state.tr
    tr.insert(insertAt, newStep)
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
    dispatch(tr.scrollIntoView())
    editor.commands.focus()
  }

  const addButton = (where: 'above' | 'below') => (
    <button
      type="button"
      title={where === 'above' ? 'Добавить шаг выше' : 'Добавить шаг ниже'}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => addStep(where)}
      className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {where === 'above' ? <BetweenVerticalStart className="size-3.5" /> : <BetweenVerticalEnd className="size-3.5" />}
    </button>
  )

  return (
    <NodeViewWrapper as="div" className="group/step relative mt-[10px] [counter-increment:recipe-step]">
      <div className="grid grid-cols-[34px_1fr] gap-3 rounded-[10px] border border-dashed border-border bg-background p-[12px_14px] transition-colors focus-within:border-ring [.ProseMirror-selectednode:not(.node-recipeSteps)_&]:border-blue-600">
        <div className="flex flex-col items-center gap-1.5 self-start" contentEditable={false}>
          <span
            aria-hidden="true"
            className="flex size-[34px] items-center justify-center rounded-lg bg-muted text-red-400 before:text-base before:font-bold before:leading-none before:content-[counter(recipe-step)]"
          />
        </div>
        <NodeViewContent className="min-w-0" />
      </div>
      <BlockToolbar onDelete={deleteNode} visibleClassName={TOOLBAR_VISIBILITY}>
        {addButton('above')}
        {addButton('below')}
      </BlockToolbar>
    </NodeViewWrapper>
  )
}
