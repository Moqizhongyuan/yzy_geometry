import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { Scene } from './canvas/core'
import { OrbitController } from './canvas/controler'
import { Rectangle } from './canvas/geometry'
import { Img } from './canvas/objects'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [orbitController, setOrbit] = useState<OrbitController>()
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = divRef.current?.offsetWidth ?? 1000
    canvas.height = divRef.current?.offsetHeight ?? 1000
    divRef.current?.appendChild(canvas)
    const scene = new Scene('coordinate')
    scene.canvas = canvas
    const rect = new Rectangle(20, 20)
    scene.add(rect)
    const image = new Image()
    image.src =
      'https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/1.png'
    const pattern = new Img({ image })
    scene.add(pattern)
    scene.render()
    const orbitController = new OrbitController(scene.camera)
    orbitController.addEventListener('change', () => {
      scene.render()
    })
    setOrbit(orbitController)
  }, [])
  const [isDragging, setIsDragging] = useState(false)
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
