import { Scene } from '@canvas/core'
import {
  ImgController,
  OrbitController,
  RectController
} from '@canvas/controller'
import { Vector2 } from '@canvas/math'
import { Img, Rectangle } from '@canvas/objects'
import { selectObj } from '@canvas/utils'
import { useEffect, useRef, useState } from 'react'

type Geometry = 'rectangle' | 'image' | null

type Drawer = {
  geometry: Geometry
  rects: Rectangle[]
  imgs: Img[]
}

const Canvas = ({
  setGeometry,
  drawer
}: {
  setGeometry: (value: React.SetStateAction<Geometry>) => void
  drawer: React.MutableRefObject<Drawer>
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState('default')
  const hover = useRef<Rectangle | Img | null>(null)
  useEffect(() => {
    function updateMouseCursor() {
      if (imgController.mouseState) {
        setCursor('none')
      } else if (hover.current) {
        setCursor('pointer')
      } else {
        setCursor('default')
      }
    }
    const canvas = document.createElement('canvas')
    canvas.width = divRef.current?.offsetWidth ?? 1000
    canvas.height = divRef.current?.offsetHeight ?? 1000
    divRef.current?.appendChild(canvas)
    const scene = new Scene('coordinate')
    scene.setOption({ canvas })
    const imgController = new ImgController()
    const rectController = new RectController()
    scene.add(imgController)
    scene.add(rectController)

    const orbitController = new OrbitController(scene.camera)
    orbitController.addEventListener('change', () => {
      scene.render()
    })
    imgController.addEventListener('change', () => {
      scene.render()
    })
    rectController.addEventListener('change', () => {
      scene.render()
    })
    canvas.addEventListener('pointerdown', (event: PointerEvent) => {
      const { button, clientX, clientY } = event
      const mp = scene.clientToClip(clientX, clientY)
      // let hover: Rectangle | Img | null = null
      switch (button) {
        case 0:
          if (drawer.current.geometry === 'rectangle') {
            const rect = new Rectangle({
              offset: new Vector2(mp.x - 100, mp.y - 100),
              size: new Vector2(200, 200)
            })
            scene.add(rect)
            drawer.current.rects.push(rect)
            scene.render()
          } else if (drawer.current.geometry === 'image') {
            console.log('object')
          }
          setGeometry(null)
          drawer.current.geometry = null
          hover.current = selectObj(
            [...drawer.current.rects, ...drawer.current.imgs],
            mp,
            scene
          )
          if (hover instanceof Rectangle) {
            rectController.pointerdown(hover, mp)
          } else if (hover instanceof Img) {
            imgController.pointerdown(hover, mp)
          } else {
            const hoverVal = hover.current as null
            rectController.pointerdown(hoverVal, mp)
            imgController.pointerdown(hoverVal, mp)
          }
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
      rectController.pointermove(mp)
      updateMouseCursor()
    })

    canvas.addEventListener('wheel', ({ deltaY }) => {
      orbitController.doScale(deltaY)
    })
    window.addEventListener('pointerup', (event: PointerEvent) => {
      switch (event.button) {
        case 0:
          imgController.pointerup()
          rectController.pointerup()
          break
        case 1:
          orbitController.pointerup()
          break
      }
    })

    window.addEventListener(
      'keydown',
      ({ key, altKey, shiftKey }: KeyboardEvent) => {
        if (key === 'Delete') {
          if (hover.current instanceof Rectangle) {
            drawer.current.rects.splice(
              drawer.current.rects.indexOf(hover.current),
              1
            )
          }
          hover.current = null
        }
        imgController.keydown(key, altKey, shiftKey)
        rectController.keydown(key, altKey, shiftKey)

        updateMouseCursor()
      }
    )
    window.addEventListener('keyup', ({ altKey, shiftKey }: KeyboardEvent) => {
      imgController.keyup(altKey, shiftKey)
      rectController.keyup(altKey, shiftKey)
    })

    scene.render()
  }, [])
  return <div className={`w-full h-full cursor-${cursor}`} ref={divRef}></div>
}

export default Canvas
