import { Prisma } from '../../generated/prisma/client';

export const CATEGORY_ANCESTOR_SELECT = {
  id: true,
  name: true,
  alias: true,
  parentId: true,
} as const satisfies Prisma.CategorySelect;

export type CategoryAncestorRow = Prisma.CategoryGetPayload<{
  select: typeof CATEGORY_ANCESTOR_SELECT;
}>;

export function buildAncestors(
  rows: CategoryAncestorRow[],
  startParentId?: string | null,
): CategoryAncestorRow[] {
  const byId = new Map(rows.map((row) => [row.id, row]));

  const ancestors: CategoryAncestorRow[] = [];
  let current = startParentId ? byId.get(startParentId) : undefined;
  while (current) {
    ancestors.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return ancestors;
}
