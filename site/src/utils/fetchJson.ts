export async function fetchJson (url: string): Promise<any> {
  try {
    const res = await fetch(url)

    if (!res.ok) {
      return { data: [] }
    }

    return await res.json()
  } catch {
    return { data: [] }
  }
}
