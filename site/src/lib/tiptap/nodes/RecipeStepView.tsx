'use client'

import React, { useEffect, useRef } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { GripVertical, Plus, Trash2 } from 'lucide-react'

export function RecipeStepView({ deleteNode, editor, getPos }: NodeViewProps) {
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  const gripRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const grip = gripRef.current
    if (!grip) return
    const onMouseDown = () => {
      const pos = getPosRef.current()
      if (pos != null) editor.commands.setNodeSelection(pos)
    }
    grip.addEventListener('mousedown', onMouseDown)
    return () => grip.removeEventListener('mousedown', onMouseDown)
  }, [editor])

  const addStep = (where: 'above' | 'below') => {
    const pos = getPosRef.current()
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

  const deleteStep = () => {
    const pos = getPosRef.current()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    let containerDepth = -1
    for (let d = $pos.depth; d > 0; d--) {
      if ($pos.node(d).type.name === 'recipeSteps') {
        containerDepth = d
        break
      }
    }
    if (containerDepth > -1 && $pos.node(containerDepth).childCount <= 1) {
      const container = $pos.node(containerDepth)
      const start = $pos.before(containerDepth)
      const end = start + container.nodeSize
      const tr = state.tr
      tr.delete(start, end)
      tr.setSelection(TextSelection.near(tr.doc.resolve(start), 1))
      dispatch(tr.scrollIntoView())
      editor.commands.focus()
      return
    }
    deleteNode()
  }

  const addButton = (where: 'above' | 'below') => (
    <div
      className={`recipe-step__add recipe-step__add--${where}`}
      contentEditable={false}
    >
      <button
        type="button"
        title={where === 'above' ? 'Добавить шаг выше' : 'Добавить шаг ниже'}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => addStep(where)}
      >
        <Plus className="size-3.5" />
        Шаг
      </button>
    </div>
  )

  return (
    <NodeViewWrapper as="div" className="recipe-step" data-recipe-step>
      {addButton('above')}
      <div className="recipe-step__grid">
        <div
          ref={gripRef}
          className="recipe-step__drag"
          contentEditable={false}
          draggable
          title="Перетащить шаг"
        >
          <GripVertical className="size-4" />
        </div>
        <span
          className="recipe-step__num"
          contentEditable={false}
          aria-hidden="true"
        />
        <NodeViewContent className="recipe-step__body" />
        <button
          type="button"
          className="recipe-step__delete"
          title="Удалить шаг"
          contentEditable={false}
          onMouseDown={(e) => e.preventDefault()}
          onClick={deleteStep}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {addButton('below')}
    </NodeViewWrapper>
  )
}
