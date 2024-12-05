import React, { useEffect, useRef, useState } from 'react'
import './index.css'
import { GeometryMenu, MenuItem } from './components/GeometryMenu'
import { Scene } from './canvas/core'
import {
  ImgController,
  OrbitController,
  RectController
} from './canvas/controller'
import { Img, Rectangle } from './canvas/objects'
import { Vector2 } from './canvas/math'
import { selectObj } from './canvas/utils'
// import GeometryForm from './components/GeometryForm'

const items: MenuItem[] = [
  {
    key: 'rectangle',
    label: '矩形'
  },
  // {
  //   key: 'image',
  //   label: '图像',
  //   children: [
  //     {
  //       key: 'internetImg',
  //       label: '线上图像'
  //     },
  //     {
  //       key: 'localImg',
  //       label: '本地图像'
  //     }
  //   ]
  // },
  {
    key: 'cancel',
    label: '取消'
  }
]

type Geometry = 'rectangle' | 'image' | null

type Drawer = {
  geometry: Geometry
  rects: Rectangle[]
  imgs: Img[]
}

const App: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry>(null)
  const drawer = useRef<Drawer>({
    geometry: null,
    rects: [],
    imgs: []
  })
  useEffect(() => {
    //     function updateMouseCursor() {
    //   if (imgController.mouseState) {
    //     setCursor('none')
    //   } else if (imgHover) {
    //     setCursor('pointer')
    //   } else {
    //     setCursor('default')
    //   }
    // }
    // let imgHover: Img | null | Rectangle
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
      let hover: Rectangle | Img | null = null
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
          hover = selectObj(
            [...drawer.current.rects, ...drawer.current.imgs],
            mp,
            scene
          )
          if (hover instanceof Rectangle) {
            console.log('rect')
            rectController.pointerdown(hover, mp)
          } else if (hover instanceof Img) {
            imgController.pointerdown(hover, mp)
          } else {
            rectController.pointerdown(hover, mp)
            imgController.pointerdown(hover, mp)
          }
          // updateMouseCursor()
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
      // updateMouseCursor()
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

    // window.addEventListener(
    //   'keydown',
    //   ({ key, altKey, shiftKey }: KeyboardEvent) => {
    //     imgController.keydown(key, altKey, shiftKey)
    //     rectController.keydown(key, altKey, shiftKey)
    //     updateMouseCursor()
    //   }
    // )
    // window.addEventListener('keyup', ({ altKey, shiftKey }: KeyboardEvent) => {
    //   imgController.keyup(altKey, shiftKey)
    //   rectController.keyup(altKey, shiftKey)
    // })

    scene.render()
  }, [])
  return (
    <div className="flex h-full relative">
      <GeometryMenu
        clickFn={e => {
          const geometry = e.key as Geometry
          setGeometry(geometry)
          drawer.current.geometry = geometry
        }}
        items={items}
        selectKeys={[geometry ?? '']}
      />
      <div className="w-full h-full" ref={divRef}></div>
      {/* <GeometryForm /> */}
    </div>
  )
}

export default App
