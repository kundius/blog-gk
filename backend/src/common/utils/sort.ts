export type OrderBy = Array<Record<string, 'asc' | 'desc'>>;

export function parseSort(sort: string | undefined, fallback: Record<string, 'asc' | 'desc'>): OrderBy {
  if (!sort) return [fallback];

  return sort
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const desc = part.startsWith('-');
      const field = desc ? part.slice(1) : part;
      return { [field]: desc ? 'desc' : 'asc' };
    });
}
