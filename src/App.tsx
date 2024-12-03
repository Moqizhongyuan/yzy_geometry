import React, { useRef } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { useCanvas, useCanvasGrid } from './hooks'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const { canvas } = useCanvas(divRef.current)
  useCanvasGrid(canvas)

  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div ref={divRef} className="h-full w-full"></div>
    </div>
  )
}

export default App
