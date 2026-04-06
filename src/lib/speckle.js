// ─── URL Parser ────────────────────────────────────────────────────────────

export function parseSpeckleUrl(url) {
  try {
    const u = new URL(url.trim())
    const host = u.origin
    const projectMatch = url.match(/\/projects\/([a-f0-9]+)\/models\/([a-f0-9@]+)/)
    if (projectMatch) {
      return { host, projectId: projectMatch[1], modelId: projectMatch[2] }
    }
  } catch {}
  return null
}

// ─── GraphQL fetch (only used for version/model metadata) ──────────────────────

export async function fetchSpeckle(host, query, variables = {}, token = '') {
  const headers = {
    'Content-Type': 'application/json',
    'apollo-require-preflight': 'true',
  }
  if (token?.trim()) headers['Authorization'] = `Bearer ${token.trim()}`

  let res
  try {
    res = await fetch(`${host}/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })
  } catch {
    throw new Error(
      `Network error — could not reach ${host}. ` +
      `Make sure you are running on a local server (npm run dev), not a file:// URL.`
    )
  }

  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch {}
    throw new Error(`GraphQL ${res.status} ${res.statusText}${body ? ': ' + body.slice(0, 200) : ''}`)
  }

  const data = await res.json()
  if (data.errors) throw new Error(data.errors.map(e => e.message).join(' | '))
  return data.data
}

export async function fetchObjectsREST(host, projectId, objectId, token = '') {
  const url = `${host}/objects/${projectId}/${objectId}`
  const headers = { Accept: 'text/plain' }
  if (token?.trim()) headers['Authorization'] = `Bearer ${token.trim()}`

  let res
  try {
    res = await fetch(url, { method: 'GET', headers })
  } catch {
    throw new Error(
      `Network error — could not reach ${host}. ` +
      `Make sure you are running on a local server (npm run dev), not a file:// URL.`
    )
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error(
      `Access denied (${res.status}). This is a private model — ` +
      `add your Personal Access Token via the token button.`
    )
  }
  if (!res.ok) {
    throw new Error(`REST API error ${res.status} ${res.statusText}`)
  }

  // Response is a stream of lines: "objectId\t{json}\n"
  const text = await res.text()
  const objects = []

  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const tabIndex = trimmed.indexOf('\t')
    if (tabIndex === -1) continue

    const jsonPart = trimmed.slice(tabIndex + 1)
    try {
      const parsed = JSON.parse(jsonPart)
      objects.push(parsed)
    } catch {
      // skip malformed lines
    }
  }

  return objects
}

// ─── GraphQL query — only needed for project name + model name + version ───────

export const Q_VERSION = `
  query GetVersion($projectId: String!, $modelId: String!) {
    project(id: $projectId) {
      name
      model(id: $modelId) {
        displayName
        versions(limit: 1) {
          items {
            id
            message
            referencedObject
            createdAt
          }
        }
      }
    }
  }
`
