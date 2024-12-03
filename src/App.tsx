import React, { useRef } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { useCanvas, useCanvasGrid } from './hooks'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const { canvas } = useCanvas(divRef.current)
  useCanvasGrid(canvas)
  const ctx = canvas?.getContext('2d')
  ctx?.scale(2, 2)

  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div ref={divRef} className="h-full w-full"></div>
    </div>
  )
}

export default App
