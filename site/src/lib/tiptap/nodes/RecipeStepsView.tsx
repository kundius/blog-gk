'use client'

import { useRef } from 'react'
import type { FormEvent } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps
} from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { Plus } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'
import { RECIPE_STEPS_TITLE } from './helpers'

export function RecipeStepsView({
  node,
  updateAttributes,
  deleteNode,
  editor,
  getPos
}: NodeViewProps) {
  const initializedRef = useRef(false)

  const setInitialTitle = (el: HTMLHeadingElement | null) => {
    if (el && !initializedRef.current) {
      initializedRef.current = true
      el.textContent = node.attrs.title || RECIPE_STEPS_TITLE
    }
  }

  const onTitleInput = (e: FormEvent<HTMLHeadingElement>) => {
    updateAttributes({ title: e.currentTarget.textContent?.trim() || '' })
  }

  const addStep = () => {
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const $pos = state.doc.resolve(pos)
    const stepsNode = $pos.nodeAfter
    if (!stepsNode) return
    const insertAt = pos + stepsNode.nodeSize - 1
    const newStep = state.schema.nodes.recipeStep.create(
      null,
      state.schema.nodes.paragraph.create(),
    )
    const tr = state.tr
    tr.insert(insertAt, newStep)
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
    dispatch(tr.scrollIntoView())
    editor.commands.focus()
  }

  return (
    <NodeViewWrapper as="section" className="recipe-steps">
      <header className="recipe-steps__header" contentEditable={false}>
        <h2
          ref={setInitialTitle}
          className="recipe-steps__title"
          contentEditable
          suppressContentEditableWarning
          onInput={onTitleInput}
        />
        <BlockToolbar onDelete={deleteNode}>
          <button
            type="button"
            title="Добавить шаг"
            className="block-toolbar__add"
            onMouseDown={(e) => e.preventDefault()}
            onClick={addStep}
          >
            <Plus />
            <span>Добавить шаг</span>
          </button>
        </BlockToolbar>
      </header>
      <div className="recipe-steps__body">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}
