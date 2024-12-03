import React, { useRef, useState } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { useCanvas, useCanvasGrid } from './hooks'
import { useScene } from './hooks/useScene'
import { useOrbitController } from './hooks/useOrbitController'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const { canvas } = useCanvas(divRef.current)
  useCanvasGrid(canvas)
  const scene = useScene(canvas)
  const orbitController = useOrbitController(scene?.camera)
  const [isDragging, setIsDragging] = useState(false)
  // const [lastPosition, setLastPosition] = useState<{
  //   x: number
  //   y: number
  // } | null>(null)
  orbitController?.addEventListener('change', () => {
    scene?.render()
  })

  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div
        ref={divRef}
        onMouseDown={e => {
          setIsDragging(true)
          orbitController?.pointerdown(e.clientX, e.clientY)
          console.log(e.clientX, e.clientY)
        }}
        onMouseMove={e => {
          //   const currentX = e.clientX
          //   const currentY = e.clientY
          //   if (lastPosition && isDragging) {
          //     const deltaX = currentX - lastPosition.x
          //     const deltaY = currentY - lastPosition.y
          //     // 判断移动的方向
          //     if (Math.abs(deltaX) > Math.abs(deltaY)) {
          //       if (deltaX > 0) {
          //         console.log(deltaX)
          //       } else {
          //         console.log(deltaX)
          //       }
          //     } else {
          //       if (deltaY > 0) {
          //         console.log(deltaY)
          //       } else {
          //         console.log(deltaY)
          //       }
          //     }
          //     scene?.render()
          //   }
          //   setLastPosition({ x: currentX, y: currentY })
          orbitController?.pointermove(e.clientX, e.clientY)
        }}
        onMouseUp={() => {
          setIsDragging(false)
          orbitController?.pointerup()
        }}
        className={`${isDragging ? 'cursor-grab' : 'cursor-default'} h-full w-full`}
      ></div>
    </div>
  )
}

export default App
