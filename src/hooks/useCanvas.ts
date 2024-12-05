import { useEffect } from 'react'
import { Scene } from '../canvas/core'

export function useCanvas(parent: HTMLElement | null) {
  console.log(parent)
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = parent?.offsetHeight ?? 1000
    canvas.height = parent?.offsetWidth ?? 1000
    const scene = new Scene('grid')
    scene.setOption({ canvas })
    scene.render()
    parent?.appendChild(canvas)
  }, [parent])
}

// useEffect(() => {
//   function updateMouseCursor() {
//     if (imgController.mouseState) {
//       setCursor('none')
//     } else if (imgHover) {
//       setCursor('pointer')
//     } else {
//       setCursor('default')
//     }
//   }
//   let imgHover: Img | null | Rectangle
//   const canvas = document.createElement('canvas')
//   canvas.width = divRef.current?.offsetWidth ?? 1000
//   canvas.height = divRef.current?.offsetHeight ?? 1000
//   divRef.current?.appendChild(canvas)
//   const scene = new Scene('grid')
//   scene.setOption({ canvas })
//   const rect = new Rectangle({
//     offset: new Vector2(-100, -100),
//     size: new Vector2(200, 200)
//   })
//   scene.add(rect)
//   const image = new Image()
//   image.src =
//     'https://yxyy-pandora.oss-cn-beijing.aliyuncs.com/stamp-images/1.png'
//   const pattern1 = new Img({ image, offset: new Vector2(20, 20) })
//   pattern1.name = 'aaa'
//   scene.add(pattern1)
//   const imgController = new ImgController()
//   const rectController = new RectController()
//   scene.add(imgController)
//   scene.add(rectController)

//   const orbitController = new OrbitController(scene.camera)
//   orbitController.addEventListener('change', () => {
//     scene.render()
//   })
//   imgController.addEventListener('change', () => {
//     scene.render()
//   })
//   rectController.addEventListener('change', () => {
//     scene.render()
//   })
//   canvas.addEventListener('pointerdown', (event: PointerEvent) => {
//     const { button, clientX, clientY } = event
//     const mp = scene.clientToClip(clientX, clientY)
//     switch (button) {
//       case 0:
//         imgHover = selectObj([rect], mp, scene)
//         // imgController.pointerdown(imgHover, mp)
//         rectController.pointerdown(imgHover, mp)
//         updateMouseCursor()
//         break
//       case 1:
//         orbitController.pointerdown(clientX, clientY)
//         break
//     }
//   })
//   canvas.addEventListener('pointermove', (event: PointerEvent) => {
//     const { clientX, clientY } = event
//     orbitController.pointermove(clientX, clientY)
//     const mp = scene.clientToClip(clientX, clientY)
//     imgController.pointermove(mp)
//     rectController.pointermove(mp)
//     updateMouseCursor()
//   })

//   canvas.addEventListener('wheel', ({ deltaY }) => {
//     orbitController.doScale(deltaY)
//   })
//   window.addEventListener('pointerup', (event: PointerEvent) => {
//     switch (event.button) {
//       case 0:
//         imgController.pointerup()
//         rectController.pointerup()
//         break
//       case 1:
//         orbitController.pointerup()
//         break
//     }
//   })

//   /* 键盘按下 */
//   window.addEventListener(
//     'keydown',
//     ({ key, altKey, shiftKey }: KeyboardEvent) => {
//       imgController.keydown(key, altKey, shiftKey)
//       rectController.keydown(key, altKey, shiftKey)
//       updateMouseCursor()
//     }
//   )

//   /* 键盘抬起 */
//   window.addEventListener('keyup', ({ altKey, shiftKey }: KeyboardEvent) => {
//     imgController.keyup(altKey, shiftKey)
//     rectController.keyup(altKey, shiftKey)
//   })

//   scene.render()
// }, [])
