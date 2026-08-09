export const INGREDIENTS_MARKER_HTML = '<div data-ingredients="true"></div>'

export function hasIngredientsMarker(html?: string | null): boolean {
  return Boolean(html?.includes(INGREDIENTS_MARKER_HTML))
}
