import { EventDispatcher } from '../core'
import { Object2D } from '../objects'
import { Group, Rectangle, Img } from '../objects'
import { Scene } from '../core'
import { OrbitController, RectController } from '../controller'
import { ImgController } from '../controller'
import { selectObj } from '../utils'
import { Vector2 } from '@canvas/math'

export type CursorType = 'none' | 'default' | 'pointer'

class Editor extends EventDispatcher {
  /* 编辑器场景 */
  editorScene = new Scene()
  /* 编辑器中的图案 */
  group = new Group()
  /* 图案控制器 */
  imgController = new ImgController()
  // 矩形控制器
  rectController = new RectController()
  /* 相机轨道控制器 */
  orbitController = new OrbitController(this.editorScene.camera)
  /* 鼠标划入的图形 */
  objHover: Object2D | null = null
  /* 鼠标状态 */
  cursor: [CursorType, React.Dispatch<React.SetStateAction<CursorType>>]

  designSize = 0

  designImg = new Img({
    index: 1000
  })

  resultScene = new Scene()

  resultGroup = new Group()

  constructor(
    reactCursor: [CursorType, React.Dispatch<React.SetStateAction<CursorType>>]
  ) {
    super()
    const {
      editorScene,
      orbitController,
      group,
      imgController,
      rectController,
      designImg,
      resultScene,
      resultGroup
    } = this
    /* 编辑器场景*/
    editorScene.add(group, imgController, rectController, designImg)
    resultScene.add(resultGroup)
    this.cursor = reactCursor

    /* 渲染编辑器和虚拟场景 */
    imgController.addEventListener('change', () => {
      this.render()
    })
    rectController.addEventListener('change', () => {
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
      }
      this.render()
    })
    imgController.addEventListener('transformed', ({ obj }) => {
      const { position, rotate, scale, offset, size } = obj as Img
      const resultImg = resultGroup.children[group.children.indexOf(obj as Img)]
      if (resultImg instanceof Img) {
        resultImg.setOption({
          position,
          rotate,
          scale,
          offset,
          size
        })
      }
    })
    // 删除图案
    group.addEventListener('remove', ({ obj }) => {
      resultGroup.getObjectByProperty('uuid', (obj as Img).uuid)?.remove()
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
      this.editorScene.render()
    }
  }

  addGeometry(geometry: HTMLImageElement | string) {
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
      this.imgController.img = img
      return img
    } else if (geometry === 'rect') {
      const rect = new Rectangle({ layerNum, name: '图层' + layerNum })
      this.setGeometry2DSize(rect, 0.5)
      this.group.add(rect)
      return rect
    }
  }

  setGeometry2DSize(geometry: Img | Rectangle, ratio: number) {
    let width = 0,
      height = 0
    if (geometry instanceof Img) {
      width = (geometry.image as HTMLImageElement).width
      height = (geometry.image as HTMLImageElement).height
    } else {
      width = 200
      height = 200
    }
    const { designSize } = this
    const w = designSize * ratio
    const h = (w * height) / width
    geometry.size.set(w, h)
    geometry.offset.set(-w / 2, -h / 2)
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
    const {
      editorScene,
      imgController,
      rectController,
      group,
      orbitController
    } = this
    const { button, clientX, clientY } = event
    const mp = editorScene.clientToClip(clientX, clientY)
    switch (button) {
      case 0:
        this.objHover = selectObj(editorScene)(group.children, mp)
        if (this.objHover instanceof Rectangle) {
          rectController.pointerdown(this.objHover, mp)
        } else if (this.objHover instanceof Img) {
          imgController.pointerdown(this.objHover, mp)
        } else {
          const hoverVal = this.objHover as null
          rectController.pointerdown(hoverVal, mp)
          imgController.pointerdown(hoverVal, mp)
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
    const {
      editorScene,
      imgController,
      group,
      orbitController,
      rectController
    } = this
    const { clientX, clientY } = event
    const mp = editorScene.clientToClip(clientX, clientY)
    orbitController.pointermove(clientX, clientY)
    imgController.pointermove(mp)
    rectController.pointermove(mp)
    this.objHover = selectObj(editorScene)(group.children, mp)
    this.updateMouseCursor()
  }

  /* 鼠标抬起 */
  pointerup({ button }: PointerEvent) {
    switch (button) {
      case 0:
        this.imgController.pointerup()
        this.rectController.pointerup()
        break
      case 1:
        this.orbitController.pointerup()
        break
    }
  }

  /* 键盘按下 */
  keydown({ key, altKey, shiftKey }: KeyboardEvent) {
    this.imgController.keydown(key, altKey, shiftKey)
    this.rectController.keydown(key, altKey, shiftKey)
    this.updateMouseCursor()
  }

  /* 键盘抬起 */
  keyup({ altKey, shiftKey }: KeyboardEvent) {
    this.imgController.keyup(altKey, shiftKey)
    this.rectController.keyup(altKey, shiftKey)
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
    const { imgController, cursor, objHover } = this
    if (imgController.mouseState) {
      cursor[1]('none')
    } else if (objHover) {
      cursor[1]('pointer')
    } else {
      cursor[1]('default')
    }
  }

  /* 设计图和效果图的渲染 */
  render() {
    this.editorScene.render()
    this.resultScene.render()
    this.dispatchEvent({ type: 'render' })
  }
}

export { Editor }
