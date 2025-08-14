export const API = async (path, opts = {}) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  const res = await fetch(`${base}${path}`, { ...opts, cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
