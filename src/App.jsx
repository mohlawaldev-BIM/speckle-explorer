import { useState, useMemo } from 'react'
import Header from './components/Header'
import UrlInput from './components/UrlInput'
import ErrorBanner from './components/ErrorBanner'
import ModelInfo from './components/ModelInfo'
import CategoryList from './components/CategoryList'
import PropertiesPanel from './components/PropertiesPanel'
import EmptyHero from './components/EmptyHero'
import { useSpeckleModel } from './hooks/useSpeckleModel'
import { exportCategoryExcel, exportAllExcel } from './lib/utils'

export default function App() {
  const {
    status,
    error,
    projectName,
    modelName,
    allObjects,
    categories,
    loadModel,
  } = useSpeckleModel()

  const [selectedCat, setSelectedCat] = useState(null)
  const [currentUrl, setCurrentUrl] = useState('')

  const catEntries = useMemo(
    () => Object.entries(categories).sort((a, b) => b[1].length - a[1].length),
    [categories]
  )

  const selectedObjects = selectedCat ? (categories[selectedCat] ?? []) : []

  function handleLoad(url, token) {
    setCurrentUrl(url)
    setSelectedCat(null)
    loadModel(url, token)
  }

  function handleExportCategory() {
    exportCategoryExcel({
      category: selectedCat,
      objects: selectedObjects,
      projectName,
      modelName,
      url: currentUrl,
    })
  }

  function handleExportAll() {
    exportAllExcel({ categories, projectName, modelName, url: currentUrl })
  }

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      <Header objectCount={allObjects.length} status={status} />

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6 gap-6">

        {/* Step 1 — URL input */}
        <UrlInput onLoad={handleLoad} isLoading={status === 'loading'} />

        {/* Error */}
        {status === 'error' && <ErrorBanner message={error} />}

        {/* Model info bar */}
        {status === 'done' && (
          <ModelInfo
            projectName={projectName}
            modelName={modelName}
            objectCount={allObjects.length}
            categoryCount={catEntries.length}
            onExportAll={handleExportAll}
          />
        )}

        {/* Step 2 + 3 — Categories + Properties */}
        {status === 'done' && catEntries.length > 0 && (
          <div className="flex gap-5 flex-1 min-h-0">
            <CategoryList
              entries={catEntries}
              selectedCat={selectedCat}
              onSelect={setSelectedCat}
            />
            <PropertiesPanel
              selectedCat={selectedCat}
              objects={selectedObjects}
              onExport={handleExportCategory}
            />
          </div>
        )}

        {/* Idle state */}
        {status === 'idle' && <EmptyHero />}

      </div>
    </div>
  )
}
