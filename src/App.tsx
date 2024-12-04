import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { GeometryMenu } from './components/GeometryMenu'
import { Scene } from './canvas/core'
import { ImgController, OrbitController } from './canvas/controller'
import { Rectangle } from './canvas/geometry'
import { Img } from './canvas/objects'
import { Vector2 } from './canvas/math'
import { selectObj } from './canvas/utils'

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState('default')

  useEffect(() => {
    function updateMouseCursor() {
      if (imgController.mouseState) {
        setCursor('none')
      } else if (imgHover) {
        setCursor('pointer')
      } else {
        setCursor('default')
      }
    }
    let imgHover: Img | null
    const canvas = document.createElement('canvas')
    canvas.width = divRef.current?.offsetWidth ?? 1000
    canvas.height = divRef.current?.offsetHeight ?? 1000
    divRef.current?.appendChild(canvas)
    const scene = new Scene('grid')
    scene.setOption({ canvas })
    const rect = new Rectangle({
      offset: new Vector2(-100, -100),
      size: new Vector2(50, 50)
    })
    scene.add(rect)
    const image = new Image()
    image.src =
      'https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/1.png'
    const pattern1 = new Img({ image, offset: new Vector2(20, 20) })
    const pattern2 = new Img({ image, offset: new Vector2(-800, 20) })
    pattern1.name = 'aaa'
    pattern2.name = 'bbb'
    scene.add(pattern1)
    scene.add(pattern2)
    const imgController = new ImgController()
    scene.add(imgController)

    const orbitController = new OrbitController(scene.camera)
    orbitController.addEventListener('change', () => {
      scene.render()
    })
    imgController.addEventListener('change', () => {
      scene.render()
    })
    canvas.addEventListener('pointerdown', (event: PointerEvent) => {
      const { button, clientX, clientY } = event
      const mp = scene.clientToClip(clientX, clientY)
      switch (button) {
        case 0:
          imgHover = selectObj([pattern1, pattern2], mp, scene)
          console.log(mp)
          imgController.pointerdown(imgHover, mp)
          updateMouseCursor()
          break
        case 1:
          orbitController.pointerdown(clientX, clientY)
          break
      }
    })
    canvas.addEventListener('pointermove', (event: PointerEvent) => {
      const { clientX, clientY } = event
      orbitController.pointermove(clientX, clientY)
      const mp = scene.clientToClip(clientX, clientY)
      imgController.pointermove(mp)
      updateMouseCursor()
    })

    canvas.addEventListener('wheel', ({ deltaY }) => {
      orbitController.doScale(deltaY)
    })
    window.addEventListener('pointerup', (event: PointerEvent) => {
      switch (event.button) {
        case 0:
          imgController.pointerup()
          break
        case 1:
          orbitController.pointerup()
          break
      }
    })

    /* 键盘按下 */
    window.addEventListener(
      'keydown',
      ({ key, altKey, shiftKey }: KeyboardEvent) => {
        imgController.keydown(key, altKey, shiftKey)
        updateMouseCursor()
      }
    )

    /* 键盘抬起 */
    window.addEventListener('keyup', ({ altKey, shiftKey }: KeyboardEvent) => {
      imgController.keyup(altKey, shiftKey)
    })

    scene.render()
  }, [])
  // const [isDragging, setIsDragging] = useState(false)
  return (
    <div className="flex h-full">
      <GeometryMenu />
      <div
        ref={divRef}
        // onMouseDown={e => {
        //   setIsDragging(true)
        //   orbitController?.pointerdown(e.clientX, e.clientY)
        // }}
        // onMouseMove={e => {
        //   orbitController?.pointermove(e.clientX, e.clientY)
        // }}
        // onMouseUp={() => {
        //   setIsDragging(false)
        //   orbitController?.pointerup()
        // }}
        className={`h-full w-full cursor-${cursor}`}
      ></div>
    </div>
  )
}

export default App
