// ─── URL Parser ────────────────────────────────────────────────────────────────

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

// ─── GraphQL Fetch ──────────────────────────────────────────────────────────────

export async function fetchSpeckle(host, query, variables = {}, token = '') {
  const headers = {
    'Content-Type': 'application/json',
    'apollo-require-preflight': 'true',
  }
  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`
  }

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
      `Make sure you are running this on a local server (npm run dev), not from a file:// URL.`
    )
  }

  if (!res.ok) {
    let body = ''
    try { body = await res.text() } catch {}
    throw new Error(
      `Server responded ${res.status} ${res.statusText}` +
      (body ? ': ' + body.slice(0, 200) : '')
    )
  }

  const data = await res.json()
  if (data.errors) throw new Error(data.errors.map(e => e.message).join(' | '))
  return data.data
}

// ─── GraphQL Queries ────────────────────────────────────────────────────────────

// Step 1 — get the latest version and its referencedObject ID
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

// Step 2 — fetch only the root object's own data (no children here)
export const Q_ROOT_OBJECT = `
  query GetRootObject($projectId: String!, $objectId: String!) {
    project(id: $projectId) {
      object(id: $objectId) {
        id
        data
      }
    }
  }
`

// Step 3 — fetch the first page of children for a given object
export const Q_OBJECT_CHILDREN = `
  query GetObjectChildren($projectId: String!, $objectId: String!, $cursor: String) {
    project(id: $projectId) {
      object(id: $objectId) {
        children(limit: 500, cursor: $cursor) {
          objects {
            id
            data
          }
          cursor
          totalCount
        }
      }
    }
  }
`
