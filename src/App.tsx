import React, { useRef, useState } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { useCanvas, useCanvasGrid } from './hooks'
import { useScene } from './hooks/useScene'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const { canvas } = useCanvas(divRef.current)
  useCanvasGrid(canvas)
  const scene = useScene(canvas)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  // requestAnimationFrame(scene.render)

  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div
        ref={divRef}
        onMouseDown={() => {
          setIsDragging(true)
        }}
        onMouseMove={e => {
          const currentX = e.clientX
          const currentY = e.clientY

          if (lastPosition && isDragging) {
            const deltaX = currentX - lastPosition.x
            const deltaY = currentY - lastPosition.y

            // 判断移动的方向
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX > 0) {
                console.log(deltaX)
              } else {
                console.log(deltaX)
              }
            } else {
              if (deltaY > 0) {
                console.log(deltaY)
              } else {
                console.log(deltaY)
              }
            }

            scene.render()
          }
          setLastPosition({ x: currentX, y: currentY })
        }}
        onMouseUp={() => {
          setIsDragging(false)
        }}
        className={`${isDragging ? 'cursor-grab' : 'cursor-default'} h-full w-full`}
      ></div>
    </div>
  )
}

export default App
