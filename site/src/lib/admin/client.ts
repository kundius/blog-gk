import { API_URL } from '@app/utils/config'

const TOKEN_KEY = 'admin_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (typeof window === 'undefined') return
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {}
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    setToken(null)
    if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/admin/login')) {
      window.location.href = '/admin/login'
    }
    throw new ApiError('Не авторизован', 401)
  }

  if (!res.ok) {
    let message = `Ошибка запроса: ${res.status}`
    try {
      const body = await res.json()
      if (Array.isArray(body.message)) message = body.message.join('; ')
      else if (typeof body.message === 'string') message = body.message
      else if (body.error) message = body.error
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(message, res.status)
  }

  const text = await res.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListResult<T> {
  data: T[]
  meta: PaginationMeta
}

export interface Wrapped<T> {
  data: T
}

export const api = {
  list: <T>(path: string) =>
    request<ListResult<T>>(path).then((r) => r),
  get: <T>(path: string) => request<Wrapped<T>>(path).then((r) => r.data),
  post: <T = unknown>(path: string, body?: unknown) =>
    request<Wrapped<T>>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => r.data),
  patch: <T = unknown>(path: string, body?: unknown) =>
    request<Wrapped<T>>(path, {
      method: 'PATCH',
      body: body === undefined ? undefined : JSON.stringify(body),
    }).then((r) => r.data),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
  upload: <T = unknown>(path: string, formData: FormData) =>
    request<Wrapped<T>>(path, { method: 'POST', body: formData }).then(
      (r) => r.data,
    ),
  rawRequest: request,
}

export function fileStreamUrl(id: string): string {
  return `${API_URL}/api/files/${id}/file`
}

export function slugify(input: string): string {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
    щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  }
  return input
    .toLowerCase()
    .replace(/ё/g, 'e')
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
