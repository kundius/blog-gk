import type { EditorView } from '@tiptap/pm/view'
import { Fragment, Slice, type Node } from '@tiptap/pm/model'
import { dropPoint } from '@tiptap/pm/transform'
import { TextSelection } from '@tiptap/pm/state'

let dragStartPos: number | null = null

export function setRecipeDragStart(pos: number | null) {
  dragStartPos = pos
}

export function setViewDragging(view: EditorView, node: Node) {
  const viewWithDragging = view as unknown as { dragging: { slice: Slice; move: boolean } | null }
  viewWithDragging.dragging = { slice: new Slice(Fragment.from(node), 0, 0), move: true }
}

function sliceContainsRecipeStep(slice: Slice): boolean {
  let found = false
  slice.content.forEach((node) => {
    if (node.type.name === 'recipeStep') found = true
  })
  return found
}

function isInsideRecipeSteps(view: EditorView, pos: number): boolean {
  const $pos = view.state.doc.resolve(pos)
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type.name === 'recipeSteps') return true
  }
  return false
}

function placeCursorAtFirstText(tr: { doc: Node; setSelection(selection: unknown): void }, blockPos: number) {
  const inserted = tr.doc.resolve(blockPos).nodeAfter
  let cursorPos: number | null = null
  if (inserted) {
    inserted.descendants((node, p) => {
      if (cursorPos !== null) return false
      if (node.isTextblock) {
        cursorPos = blockPos + 1 + p
        return false
      }
      return true
    })
  }
  if (cursorPos != null) {
    tr.setSelection(TextSelection.create(tr.doc, cursorPos))
  }
}

function handleRecipeStepDrop(view: EditorView, event: DragEvent, from: number): boolean {
  const doc = view.state.doc
  const stepNode = doc.nodeAt(from)
  if (!stepNode || stepNode.type.name !== 'recipeStep') return false

  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (!coords) return true

  const slice = new Slice(Fragment.from(stepNode), 0, 0)
  const target = dropPoint(doc, coords.pos, slice) ?? coords.pos
  if (target === from) return true
  if (!isInsideRecipeSteps(view, target)) return true

  const to = from + stepNode.nodeSize
  const tr = view.state.tr
  tr.delete(from, to)
  let insertAt = tr.mapping.map(target)
  insertAt = Math.max(0, Math.min(insertAt, tr.doc.content.size))
  tr.insert(insertAt, stepNode)
  if (tr.doc.eq(doc)) return true

  placeCursorAtFirstText(tr, insertAt)
  view.dispatch(tr.scrollIntoView().setMeta('uiEvent', 'drop'))
  view.focus()
  return true
}

function handleRecipeStepsDrop(view: EditorView, event: DragEvent, from: number): boolean {
  const doc = view.state.doc
  const container = doc.nodeAt(from)
  if (!container || container.type.name !== 'recipeSteps') return false

  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (!coords) return true

  const slice = new Slice(Fragment.from(container), 0, 0)
  const target = dropPoint(doc, coords.pos, slice) ?? coords.pos
  if (target === from) return true

  const to = from + container.nodeSize
  const tr = view.state.tr
  tr.delete(from, to)
  let insertAt = tr.mapping.map(target)
  insertAt = Math.max(0, Math.min(insertAt, tr.doc.content.size))
  tr.insert(insertAt, container)
  if (tr.doc.eq(doc)) return true

  placeCursorAtFirstText(tr, insertAt)
  view.dispatch(tr.scrollIntoView().setMeta('uiEvent', 'drop'))
  view.focus()
  return true
}

export function recipeStepDropGuard(
  view: EditorView,
  event: DragEvent,
  slice: Slice,
  moved: boolean,
): boolean {
  if (moved && dragStartPos != null) {
    const from = dragStartPos
    dragStartPos = null
    const node = view.state.doc.nodeAt(from)
    if (node?.type.name === 'recipeSteps') {
      return handleRecipeStepsDrop(view, event, from)
    }
    return handleRecipeStepDrop(view, event, from)
  }
  if (!moved || !sliceContainsRecipeStep(slice)) return false

  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  if (!coords) return true

  const $pos = view.state.doc.resolve(coords.pos)
  for (let d = $pos.depth; d > 0; d--) {
    if ($pos.node(d).type.name === 'recipeSteps') return false
  }
  return true
}
