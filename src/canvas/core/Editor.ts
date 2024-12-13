import { EventDispatcher } from '../core'
import { Object2D, Group, Img, Text, Rectangle, Circle } from '../objects'
import { Scene } from '../core'
import { OrbitController, TransformController } from '../controller'
import { selectObj } from '../utils'
import { Vector2 } from '@canvas/math'
import { MutableRefObject } from 'react'
import { queueScene } from '@canvas/nextTicks'

export type CursorType = 'none' | 'default' | 'pointer'

class Editor extends EventDispatcher {
  /* 编辑器场景 */
  editorScene = new Scene()
  /* 编辑器中的图案 */
  group = new Group()
  /* 控制器 */
  controller = new TransformController()
  // 矩形控制器
  /* 相机轨道控制器 */
  orbitController = new OrbitController(this.editorScene.camera)
  /* 鼠标划入的图形 */
  objHover: Object2D | null = null
  /* 鼠标状态 */
  cursor: MutableRefObject<CursorType>

  designSize = 0

  designImg = new Img({
    index: 1000,
    name: 'DesignImg'
  })

  resultScene = new Scene()

  resultGroup = new Group()

  constructor(reactCursor: MutableRefObject<CursorType>) {
    super()
    const {
      editorScene,
      orbitController,
      group,
      controller,
      designImg,
      resultScene,
      resultGroup
    } = this
    /* 编辑器场景*/
    group.name = 'editorGroup'
    resultGroup.name = 'resultGroup'
    editorScene.name = 'editorScene'
    resultScene.name = 'resultScene'
    editorScene.index = 0
    resultScene.index = 1
    editorScene.add(group, controller, designImg)
    resultScene.add(resultGroup)
    this.cursor = reactCursor

    /* 渲染编辑器和虚拟场景 */
    controller.addEventListener('change', () => {
      this.render()
    })
    orbitController.addEventListener('change', () => {
      this.render()
    })
    group.addEventListener('add', ({ obj }) => {
      if (obj instanceof Img) {
        const { image, position, rotate, scale, offset, size, uuid } = obj
        resultGroup.add(
          new Img({
            image,
            position,
            rotate,
            scale,
            offset,
            size,
            uuid
          })
        )
      } else if (obj instanceof Text) {
        const { position, rotate, scale, offset, uuid, text, style } = obj
        resultGroup.add(
          new Text({ position, rotate, scale, offset, uuid, text, style })
        )
      } else if (obj instanceof Rectangle) {
        const { position, rotate, scale, offset, uuid, style, size } = obj
        resultGroup.add(
          new Rectangle({ position, rotate, scale, offset, uuid, style, size })
        )
      } else if (obj instanceof Circle) {
        const { position, rotate, scale, offset, uuid, style, size } = obj
        resultGroup.add(
          new Circle({ position, rotate, scale, offset, uuid, style, size })
        )
      }
      this.render()
    })
    controller.addEventListener('transformed', ({ obj }) => {
      const { position, rotate, scale, offset, size, style } = obj as Object2D
      const resultObj =
        resultGroup.children[group.children.indexOf(obj as Object2D)]
      if (resultObj instanceof Img) {
        resultObj.setOption({
          position,
          rotate,
          scale,
          offset,
          size,
          style
        })
      } else if (resultObj instanceof Text) {
        resultObj.setOption({
          position,
          rotate,
          scale,
          offset,
          style
        })
      } else if (resultObj instanceof Rectangle) {
        resultObj.setOption({
          position,
          rotate,
          scale,
          offset,
          size,
          style
        })
      } else if (resultObj instanceof Circle) {
        resultObj.setOption({
          position,
          rotate,
          scale,
          offset,
          size,
          style
        })
      }
      this.render()
    })
    // 删除图案
    group.addEventListener('remove', ({ obj }) => {
      resultGroup.getObjectByProperty('uuid', (obj as Object2D).uuid)?.remove()
    })
  }

  setDesignImg(src: string) {
    const { designImg, designSize } = this
    /* 图案尺寸随设计尺寸而定，位置居中 */
    designImg.setOption({
      src,
      size: new Vector2(designSize),
      offset: new Vector2(-designSize / 2)
    })
    /* 渲染 */
    ;(designImg.image as HTMLImageElement).onload = () => {
      queueScene(this.editorScene)
    }
  }

  addGeometry(geometry: HTMLImageElement | Text | Rectangle | Circle) {
    const {
      group: { children }
    } = this

    /* 图案序号，基于最大序号递增 */
    const maxNum = Math.max(...children.map(obj => obj.layerNum))
    const layerNum = (children.length ? maxNum : 0) + 1

    /* 建立Img2D对象 */
    if (geometry instanceof HTMLImageElement) {
      const img = new Img({
        image: geometry,
        layerNum,
        name: '图层' + layerNum
      })

      /* 基于设计尺寸设置图案尺寸 */
      this.setGeometry2DSize(img, 0.5)
      /* 添加图案 */
      this.group.add(img)
      /* 选择图案 */
      this.controller.obj = img
      return img
    } else if (geometry instanceof Text) {
      const text = new Text({
        layerNum,
        name: '图层' + layerNum,
        text: geometry.text,
        style: geometry.style,
        maxWidth: geometry.maxWidth
      })
      this.setGeometry2DSize(text, 0.5)
      this.group.add(text)
      this.controller.obj = text
      return text
    } else if (geometry instanceof Rectangle) {
      const rect = new Rectangle({
        layerNum,
        name: '图层' + layerNum,
        size: geometry.size,
        style: geometry.style
      })
      this.setGeometry2DSize(rect, 0.5)
      this.group.add(rect)
      this.controller.obj = rect
      return rect
    } else if (geometry instanceof Circle) {
      const circle = new Circle({
        layerNum,
        name: '图层' + layerNum,
        size: geometry.size,
        style: geometry.style
      })
      this.setGeometry2DSize(circle, 0.5)
      this.group.add(circle)
      this.controller.obj = circle
      return circle
    }
  }

  setGeometry2DSize(geometry: Img | Text | Rectangle | Circle, ratio: number) {
    const { designSize } = this
    if (geometry instanceof Img) {
      const width = (geometry.image as HTMLImageElement).width
      const height = (geometry.image as HTMLImageElement).height
      const w = designSize * ratio
      const h = (w * height) / width
      geometry.size.set(w, h)
      geometry.offset.set(-w / 2, -h / 2)
    } else if (geometry instanceof Text) {
      geometry.scale.set((designSize * ratio) / geometry.size.height / 5)
      geometry.offset.set(0, 0)
    } else if (geometry instanceof Rectangle) {
      const w = designSize * ratio
      const h = (w * geometry.size.height) / geometry.size.width
      geometry.size.set(w, h)
      geometry.offset.set(-w / 2, -h / 2)
    } else if (geometry instanceof Circle) {
      const w = designSize * ratio
      const h = (w * geometry.size.height) / geometry.size.width
      geometry.size.set(w, h)
      geometry.offset.set(-w / 2, -h / 2)
    }
  }

  onMounted(editorDom: HTMLDivElement, effectDom: HTMLDivElement) {
    const {
      editorScene: { canvas },
      resultScene: { canvas: resultCanvas },
      resultGroup
    } = this

    /* 编辑器 */
    editorDom.append(canvas)
    const { clientWidth: dx, clientHeight: dy } = editorDom
    canvas.width = dx
    canvas.height = dy

    const designSize = Math.min(dx, dy) * 0.5
    this.designSize = designSize

    const { clientWidth: fx, clientHeight: fy } = effectDom
    resultCanvas.width = fx
    resultCanvas.height = fy
    resultGroup.setOption({
      scale: new Vector2(fx / designSize),
      position: new Vector2(0, fx * 0.12)
    })

    /* 编辑器事件监听 */
    canvas.addEventListener('pointerdown', this.pointerdown.bind(this))
    canvas.addEventListener('pointermove', this.pointermove.bind(this))
    window.addEventListener('pointerup', this.pointerup.bind(this))
    window.addEventListener('keydown', this.keydown.bind(this))
    window.addEventListener('keyup', this.keyup.bind(this))
    canvas.addEventListener('wheel', this.wheel.bind(this))
    canvas.addEventListener('contextmenu', this.contextmenu.bind(this))
  }

  onUnmounted() {
    const {
      editorScene: { canvas }
    } = this

    /* 删除canvas，避免onMounted时重复添加 */
    canvas.remove()

    /* 取消事件监听 */
    canvas.removeEventListener('pointerdown', this.pointerdown)
    canvas.removeEventListener('pointermove', this.pointermove)
    window.removeEventListener('pointerup', this.pointerup)
    window.removeEventListener('keydown', this.keydown)
    window.removeEventListener('keyup', this.keyup)
    canvas.removeEventListener('wheel', this.wheel)
    canvas.removeEventListener('contextmenu', this.contextmenu)
  }

  /* 鼠标按下 */
  pointerdown(event: PointerEvent) {
    const { editorScene, controller, group, orbitController } = this
    const { button, clientX, clientY } = event
    const mp = editorScene.clientToClip(clientX, clientY)
    switch (button) {
      case 0:
        this.objHover = selectObj(editorScene)(group.children, mp)
        if (this.objHover instanceof Img) {
          controller.pointerdown(this.objHover, mp)
        } else {
          const hoverVal = this.objHover as null
          controller.pointerdown(hoverVal, mp)
        }
        this.updateMouseCursor()
        break
      case 1:
        orbitController.pointerdown(clientX, clientY)
        break
    }
  }

  /* 鼠标移动 */
  pointermove(event: PointerEvent) {
    const { editorScene, controller, group, orbitController } = this
    const { clientX, clientY } = event
    const mp = editorScene.clientToClip(clientX, clientY)
    orbitController.pointermove(clientX, clientY)
    controller.pointermove(mp)
    this.objHover = selectObj(editorScene)(group.children, mp)
    this.updateMouseCursor()
  }

  /* 鼠标抬起 */
  pointerup({ button }: PointerEvent) {
    switch (button) {
      case 0:
        this.controller.pointerup()
        break
      case 1:
        this.orbitController.pointerup()
        break
    }
  }

  /* 键盘按下 */
  keydown({ key, altKey, shiftKey }: KeyboardEvent) {
    this.controller.keydown(key, altKey, shiftKey)
    this.updateMouseCursor()
  }

  /* 键盘抬起 */
  keyup({ altKey, shiftKey }: KeyboardEvent) {
    this.controller.keyup(altKey, shiftKey)
  }

  /* 滑动滚轮 */
  wheel({ deltaY, clientX, clientY }: WheelEvent) {
    this.orbitController.doScale(
      deltaY,
      this.editorScene.clientToClip(clientX, clientY)
    )
  }

  /* 取消右键的默认功能 */
  contextmenu(event: MouseEvent) {
    event.preventDefault()
  }

  /* 更新鼠标样式 */
  updateMouseCursor() {
    const { controller, cursor, objHover } = this
    if (controller.mouseState) {
      cursor.current = 'none'
    } else if (objHover) {
      cursor.current = 'pointer'
    } else {
      cursor.current = 'default'
    }
  }

  selectImgByUUID(uuid: string) {
    const { group, controller } = this
    const obj = group.getObjectByProperty('uuid', uuid) ?? null
    controller.obj = obj
  }

  setVisibleByUUID(uuid: string) {
    const { group } = this
    const obj = group.getObjectByProperty('uuid', uuid)
    if (obj instanceof Object2D) {
      obj.setOption({ visible: !obj.visible })
      this.resultGroup.children[group.children.indexOf(obj)].setOption({
        visible: obj.visible
      })
      this.render()
    }
  }

  replaceImg(a: number, b: number) {
    const { group, resultGroup } = this
    for (const { children } of [group, resultGroup]) {
      ;[children[a], children[b]] = [children[b], children[a]]
    }
    this.render()
  }

  /* 设计图和效果图的渲染 */
  render() {
    queueScene(this.editorScene)
    queueScene(this.resultScene)
    this.dispatchEvent({ type: 'render' })
  }
}

export { Editor }
