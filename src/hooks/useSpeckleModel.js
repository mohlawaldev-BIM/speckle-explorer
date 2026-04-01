import { useState, useCallback } from 'react'
import {
  parseSpeckleUrl,
  fetchSpeckle,
  Q_VERSION,
  Q_OBJECT,
  Q_OBJECT_CHILDREN,
} from '../lib/speckle'
import { categoriseObjects } from '../lib/utils'

export function useSpeckleModel() {
  const [status, setStatus]           = useState('idle')   // idle | loading | done | error
  const [error, setError]             = useState('')
  const [projectName, setProjectName] = useState('')
  const [modelName, setModelName]     = useState('')
  const [allObjects, setAllObjects]   = useState([])
  const [categories, setCategories]   = useState({})

  const loadModel = useCallback(async (url, token) => {
    const parsed = parseSpeckleUrl(url)
    if (!parsed) {
      setError('Invalid Speckle URL. Expected format: https://app.speckle.systems/projects/ID/models/ID')
      setStatus('error')
      return
    }

    setStatus('loading')
    setError('')
    setAllObjects([])
    setCategories({})

    const { host, projectId, modelId } = parsed

    try {
      // 1 — Get version info
      const versionData = await fetchSpeckle(host, Q_VERSION, { projectId, modelId }, token)
      const project = versionData.project
      setProjectName(project.name)
      setModelName(project.model.displayName)

      const versions = project.model.versions?.items
      if (!versions?.length) throw new Error('No versions found for this model.')
      const rootObjectId = versions[0].referencedObject

      // 2 — Fetch root object + first page of children
      const objData = await fetchSpeckle(host, Q_OBJECT, { projectId, objectId: rootObjectId }, token)
      const rootObj = objData.project.object

      let collected = []

      if (rootObj.children) {
        collected = [...rootObj.children.objects]

        // Paginate up to 2 000 objects
        let cursor = rootObj.children.cursor
        while (cursor && collected.length < 2000) {
          const more = await fetchSpeckle(
            host, Q_OBJECT_CHILDREN,
            { projectId, objectId: rootObjectId, cursor },
            token
          )
          const page = more.project.object.children
          collected = [...collected, ...page.objects]
          cursor = page.objects.length ? page.cursor : null
        }
      }

      // 3 — Also pick up inline element arrays from the root data
      if (rootObj.data) {
        Object.entries(rootObj.data).forEach(([key, val]) => {
          if (!Array.isArray(val) || !val.length) return
          if (val[0]?.referencedId) return // skip reference-only arrays
          val.forEach(el => {
            if (el && typeof el === 'object') {
              collected.push({ id: el.id ?? crypto.randomUUID(), data: el })
            }
          })
        })
      }

      setAllObjects(collected)
      setCategories(categoriseObjects(collected))
      setStatus('done')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unknown error')
      setStatus('error')
    }
  }, [])

  return { status, error, projectName, modelName, allObjects, categories, loadModel }
}
