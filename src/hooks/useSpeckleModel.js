import { useState, useCallback } from 'react'
import { parseSpeckleUrl, fetchSpeckle, fetchObjectsREST, Q_VERSION } from '../lib/speckle'
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
      // ── Step 1: GraphQL — get project/model names and the root object ID ─────
      const versionData = await fetchSpeckle(host, Q_VERSION, { projectId, modelId }, token)
      const project = versionData?.project

      if (!project)        throw new Error('Project not found. Check your URL or token.')
      if (!project.model)  throw new Error('Model not found. Check your URL or token.')

      setProjectName(project.name)
      setModelName(project.model.displayName)

      const versions = project.model.versions?.items
      if (!versions?.length) throw new Error('No versions found for this model.')

      const rootObjectId = versions[0].referencedObject
      if (!rootObjectId)  throw new Error('This version has no referenced object.')

      // ── Step 2: REST API — download root object + all children at once ────────
      const rawObjects = await fetchObjectsREST(host, projectId, rootObjectId, token)

      if (!rawObjects.length) {
        throw new Error('Model loaded but no objects were returned. The model may be empty.')
      }

      const elementObjects = rawObjects
        .slice(1)                           
        .filter(o => o && typeof o === 'object')  
        .map(o => ({ id: o.id ?? o.applicationId ?? crypto.randomUUID(), data: o }))

      // If slicing left us empty (very small model), fall back to using all objects
      const collected = elementObjects.length > 0 ? elementObjects : rawObjects
        .filter(o => o && typeof o === 'object')
        .map(o => ({ id: o.id ?? crypto.randomUUID(), data: o }))

      if (!collected.length) {
        throw new Error('Model loaded but contained no usable objects.')
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
