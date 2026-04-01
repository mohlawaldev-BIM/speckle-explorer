import * as XLSX from 'xlsx'

// ─── Flatten nested Speckle object into key-value pairs ─────────────────────────

export function flattenObject(obj, prefix = '', depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 5) return {}
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('__') || k === 'id' || k === 'applicationId') continue
    const key = prefix ? `${prefix}.${k}` : k
    if (Array.isArray(v)) {
      result[key] = `[${v.length} items]`
    } else if (v && typeof v === 'object') {
      Object.assign(result, flattenObject(v, key, depth + 1))
    } else if (v !== null && v !== undefined) {
      result[key] = v
    }
  }
  return result
}

// ─── Categorise a list of objects by their type/category field ─────────────────

export function categoriseObjects(objects) {
  const cats = {}
  objects.forEach(obj => {
    const d = obj.data || {}
    const cat =
      d.category ||
      d.speckle_type?.split('.').pop() ||
      d.type ||
      d.family ||
      d['@category'] ||
      'Uncategorized'
    if (!cats[cat]) cats[cat] = []
    cats[cat].push(obj)
  })
  return cats
}

// ─── Collect sorted property keys for a set of objects ─────────────────────────

const PRIORITY_FIELDS = ['speckle_type', 'type', 'name', 'category', 'family', 'level']

export function collectKeys(objects) {
  const keys = new Set()
  objects.forEach(obj => {
    Object.keys(flattenObject(obj.data || {})).forEach(k => keys.add(k))
  })
  return [...keys].sort((a, b) => {
    const ai = PRIORITY_FIELDS.findIndex(p => a.toLowerCase().includes(p))
    const bi = PRIORITY_FIELDS.findIndex(p => b.toLowerCase().includes(p))
    if (ai !== -1 && bi === -1) return -1
    if (bi !== -1 && ai === -1) return 1
    return a.localeCompare(b)
  })
}

// ─── Build rows for a single category ──────────────────────────────────────────

function buildRows(objects) {
  const keys = collectKeys(objects)
  return {
    keys,
    rows: objects.map(obj => {
      const flat = flattenObject(obj.data || {})
      const row = { 'Object ID': obj.id }
      keys.forEach(k => { row[k] = flat[k] ?? '' })
      return row
    }),
  }
}

// ─── Export a single category to Excel ─────────────────────────────────────────

export function exportCategoryExcel({ category, objects, projectName, modelName, url }) {
  const { rows } = buildRows(objects)

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = Object.keys(rows[0] || {}).map(k => ({
    wch: Math.min(Math.max(k.length + 2, 10), 40),
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, category.substring(0, 31))

  const infoSheet = XLSX.utils.aoa_to_sheet([
    ['Project',      projectName],
    ['Model',        modelName],
    ['Category',     category],
    ['Object Count', objects.length],
    ['Exported',     new Date().toISOString()],
    ['Source URL',   url],
  ])
  infoSheet['!cols'] = [{ wch: 16 }, { wch: 50 }]
  XLSX.utils.book_append_sheet(wb, infoSheet, 'Info')

  XLSX.writeFile(wb, `speckle_${category.replace(/[^a-z0-9]/gi, '_')}.xlsx`)
}

// ─── Export all categories to one workbook ──────────────────────────────────────

export function exportAllExcel({ categories, projectName, modelName, url }) {
  const wb = XLSX.utils.book_new()

  Object.entries(categories).forEach(([cat, objects]) => {
    const { rows } = buildRows(objects)
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = Object.keys(rows[0] || {}).map(k => ({
      wch: Math.min(Math.max(k.length + 2, 10), 40),
    }))
    XLSX.utils.book_append_sheet(wb, ws, cat.substring(0, 31))
  })

  const infoSheet = XLSX.utils.aoa_to_sheet([
    ['Project',    projectName],
    ['Model',      modelName],
    ['Categories', Object.keys(categories).length],
    ['Exported',   new Date().toISOString()],
    ['Source URL', url],
  ])
  infoSheet['!cols'] = [{ wch: 16 }, { wch: 50 }]
  XLSX.utils.book_append_sheet(wb, infoSheet, 'Info')

  XLSX.writeFile(wb, `speckle_model_all_${Date.now()}.xlsx`)
}
