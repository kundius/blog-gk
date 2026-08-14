'use client'

import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { BetweenVerticalEnd, BetweenVerticalStart } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'

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
      className="block-toolbar__add"
    >
      {where === 'above' ? <BetweenVerticalStart /> : <BetweenVerticalEnd />}
      <span>{where === 'above' ? 'Добавить выше' : 'Добавить ниже'}</span>
    </button>
  )

  return (
    <NodeViewWrapper as="div" className="recipe-step">
      <header className="recipe-step__header" contentEditable={false}>
        <span aria-hidden="true" className="recipe-step__num" />
        <BlockToolbar onDelete={deleteNode}>
          {addButton('above')}
          {addButton('below')}
        </BlockToolbar>
      </header>
      <NodeViewContent className="recipe-step__body" />
    </NodeViewWrapper>
  )
}
