import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export const RECIPE_STEPS_TITLE = 'Пошаговое приготовление'

/** Найти позицию первого узла с указанным именем в документе */
export function findFirstNode(doc: ProseMirrorNode, name: string): number | null {
  let found: number | null = null
  doc.descendants((node, pos) => {
    if (found === null && node.type.name === name) {
      found = pos
      return false
    }
    return true
  })
  return found
}

/** Есть ли в документе узел с указанным именем */
export function docHasNode(doc: ProseMirrorNode, name: string): boolean {
  let found = false
  doc.descendants((node) => {
    if (node.type.name === name) {
      found = true
      return false
    }
    return true
  })
  return found
}
