export const INGREDIENTS_MARKER_RE = /<div[^>]*data-ingredients[^>]*>\s*<\/div>/i

export function hasIngredientsMarker(html?: string | null): boolean {
  return Boolean(html && INGREDIENTS_MARKER_RE.test(html))
}
