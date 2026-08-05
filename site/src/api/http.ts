import { API_URL } from '@app/utils/config'

export function getApiUrl(): string {
  return API_URL
}

export async function fetchDetail(url: string): Promise<any> {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      return { data: null }
    }
    const json = await res.json()
    return json && json.data !== undefined ? json : { data: json }
  } catch {
    return { data: null }
  }
}

export async function postJson(url: string, body?: unknown): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : {}
}

export async function deleteJson(url: string): Promise<any> {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : {}
}
