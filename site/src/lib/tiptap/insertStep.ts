import type { Editor } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'

export function insertStep(editor: Editor) {
  const { state, dispatch } = editor.view
  const doc = state.doc
  let containerPos: number | null = null
  doc.descendants((node, pos) => {
    if (containerPos !== null || node.type.name !== 'recipeSteps') return true
    containerPos = pos
    return false
  })
  const schema = state.schema
  const newStep = schema.nodes.recipeStep.create(null, schema.nodes.paragraph.create())
  if (containerPos !== null) {
    const container = doc.nodeAt(containerPos)
    if (!container) return
    const insertAt = containerPos + container.nodeSize - 1
    const tr = state.tr
    tr.insert(insertAt, newStep)
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
    dispatch(tr.scrollIntoView())
  } else {
    const { from } = state.selection
    const block = schema.nodes.recipeSteps.create(null, newStep)
    const tr = state.tr
    const insertAt = Math.min(from, tr.doc.content.size)
    tr.insert(insertAt, block)
    tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
    dispatch(tr.scrollIntoView())
  }
  editor.commands.focus()
}
