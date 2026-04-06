import { useState, useCallback } from 'react'
import {
  parseSpeckleUrl,
  fetchSpeckle,
  Q_VERSION,
  Q_ROOT_OBJECT,
  Q_OBJECT_CHILDREN,
} from '../lib/speckle'
import { categoriseObjects } from '../lib/utils'

export function useSpeckleModel() {
  const [status, setStatus]           = useState('idle')  // idle | loading | done | error
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
      // ── Step 1: get version info and the root object ID ──────────────────────
      const versionData = await fetchSpeckle(host, Q_VERSION, { projectId, modelId }, token)
      const project = versionData?.project

      if (!project) throw new Error('Project not found. Check your URL or token.')
      if (!project.model) throw new Error('Model not found. Check your URL or token.')

      setProjectName(project.name)
      setModelName(project.model.displayName)

      const versions = project.model.versions?.items
      if (!versions?.length) throw new Error('No versions found for this model.')

      const rootObjectId = versions[0].referencedObject
      if (!rootObjectId) throw new Error('Version has no referenced object.')

      // ── Step 2: fetch the root object's own data ─────────────────────────────
      const rootData = await fetchSpeckle(host, Q_ROOT_OBJECT, { projectId, objectId: rootObjectId }, token)
      const rootObj = rootData?.project?.object

      if (!rootObj) throw new Error(
        `Root object (${rootObjectId}) not found. ` +
        `This may be a private model — make sure your token has access.`
      )

      let collected = []

      // ── Step 3: paginate through children ────────────────────────────────────
      let cursor = null
      let isFirstPage = true

      while (true) {
        const pageData = await fetchSpeckle(
          host,
          Q_OBJECT_CHILDREN,
          { projectId, objectId: rootObjectId, cursor: cursor ?? undefined },
          token
        )

        const childrenResult = pageData?.project?.object?.children

        // If children is null/undefined on the first page, model has no child objects
        if (!childrenResult) {
          if (isFirstPage) break
          break
        }

        const objects = childrenResult.objects ?? []
        collected = [...collected, ...objects]

        // Stop if no more pages or we've hit the limit
        if (!childrenResult.cursor || objects.length === 0 || collected.length >= 2000) break

        cursor = childrenResult.cursor
        isFirstPage = false
      }

      // ── Step 4: also collect inline arrays from root object's data ────────────
      if (rootObj.data && typeof rootObj.data === 'object') {
        Object.entries(rootObj.data).forEach(([key, val]) => {
          if (!Array.isArray(val) || val.length === 0) return
        
          if (val[0]?.referencedId && !val[0]?.speckle_type) return
          val.forEach(el => {
            if (el && typeof el === 'object' && !Array.isArray(el)) {
              collected.push({
                id: el.id ?? el.applicationId ?? crypto.randomUUID(),
                data: el,
              })
            }
          })
        })
      }

      if (collected.length === 0) {
        throw new Error(
          'Model loaded but no objects were found. ' +
          'The model may be empty or structured differently than expected.'
        )
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
