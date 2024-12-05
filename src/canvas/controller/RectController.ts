import { Vector2 } from '../math'
import { Object2D } from '../objects'
import { State } from '../Frame'
import { MouseShape } from './MouseShape'
import { Matrix3 } from '../math'
import { Control } from '../transformer'
import { Rectangle } from '../objects'
import { RectFrame } from '../Frame'
import { RectData, RectTransformer } from '../transformer'

const _changeEvent = { type: 'change' }

/* 变换之前的暂存数据类型 */
type TransformStage = {
  clipCenter: Vector2
  clipOpposite: Vector2
  parentPvmInvert: Matrix3
}

class RectController extends Object2D {
  // 要控制的图片
  private _rect: Rectangle | null = null
  // 图案控制框
  frame = new RectFrame()
  // 渲染顺序
  index = Infinity
  // 不受相机影响
  enableCamera = false

  mouseState: State = null

  // 鼠标的剪裁坐标
  clipMousePos = new Vector2()

  clipOrigin = new Vector2()

  // 鼠标图案
  mouseShape = new MouseShape({
    vertices: this.frame.vertices,
    center: this.frame.center,
    mousePos: this.clipMousePos
  })

  _controlState: State = null
  // alt 键是否按下
  _altKey = false
  // shift 键是否按下
  shiftKey = false
  // 图案在父级坐标系内的变换基点
  origin = new Vector2()
  // 鼠标在图案父级坐标系内的坐标位
  parentMousePos = new Vector2()
  // 选中图案时的暂存数据，用于取消变换
  controlStage: RectData = {
    position: new Vector2(),
    scale: new Vector2(1, 1),
    rotate: 0,
    offset: new Vector2()
  }
  // 变换前的暂存数据，用于设置变换基点，将裁剪坐标转图案父级坐标
  transformStage: TransformStage = {
    clipCenter: new Vector2(),
    clipOpposite: new Vector2(),
    parentPvmInvert: new Matrix3()
  }
  // 图案变换器
  rectTransformer = new RectTransformer({
    mousePos: this.parentMousePos,
    origin: this.origin
  })

  get rect() {
    return this._rect
  }
  set rect(val) {
    if (this._rect === val) {
      return
    }
    this._rect = val
    if (val) {
      this.rectTransformer.setOption({ rect: val })
      this.rectTransformer.passRectDataTo(this.controlStage)
      this.frame.rect = val
      this.dispatchEvent({ type: 'selected', rect: val })
    } else {
      this.mouseState = null
      this.controlState = null
    }
    this.dispatchEvent(_changeEvent)
  }

  get controlState() {
    return this._controlState
  }
  set controlState(val) {
    if (this._controlState === val) {
      return
    }
    this._controlState = val
    const { rect } = this
    if (!val || !rect) {
      return
    }
    // 暂存变换数据
    this.saveTransformData(rect)
    if (val === 'move') {
      return
    }
    // 设置变换基点
    if (val === 'rotate') {
      this.setRotateOrigin()
    } else if (val?.includes('scale')) {
      this.setScaleOrigin()
    }
    // 在不改变图案世界位的前提下，基于变换基点，偏移图案
    this.offsetRectByOrigin(rect)
  }

  get altKey() {
    return this._altKey
  }
  set altKey(val) {
    if (this._altKey === val) {
      return
    }
    this._altKey = val
    const { rect, controlState, rectTransformer } = this
    if (!rect) {
      return
    }
    if (controlState?.includes('scale')) {
      // 将图案回退到变换之前的状态
      rectTransformer.restoreRect()
      // 缩放基点在图案中心
      this.setScaleOrigin()
      // 根据变换基点，偏移图案
      this.offsetRectByOrigin(rect)
      // 变换图案
      this.transformRect()
    }
  }

  /* 更新鼠标在图案父级坐标系中的位置 */
  updateParentMousePos() {
    const {
      clipMousePos,
      parentMousePos,
      transformStage: { parentPvmInvert }
    } = this
    parentMousePos.copy(clipMousePos.clone().applyMatrix3(parentPvmInvert))
  }

  /* 鼠标按下 */
  pointerdown(rect: Rectangle | null, mp: Vector2) {
    if (!this.mouseState) {
      this.rect = rect
      if (!rect) {
        return
      }
    }

    // 更新鼠标裁剪位
    this.clipMousePos.copy(mp)
    // 获取鼠标状态
    this.mouseState = this.frame.getMouseState(mp)
    if (this.mouseState) {
      // 控制状态等于鼠标状态
      this.controlState = this.mouseState
      // 更新鼠标父级位
      this.updateParentMousePos()
    }
    this.dispatchEvent(_changeEvent)
  }

  pointermove(mp: Vector2) {
    if (!this.rect) {
      return
    }
    // 更新鼠标世界位
    this.clipMousePos.copy(mp)

    if (this.controlState) {
      // 更新鼠标在图案父级坐标系中的位置
      this.updateParentMousePos()
      // 变换图案
      console.log(this.rectTransformer.position)
      this.transformRect()
    } else {
      // 获取鼠标状态
      this.mouseState = this.frame.getMouseState(mp)
    }
    this.dispatchEvent(_changeEvent)
  }
  /* 变换图案 */
  transformRect() {
    const { rectTransformer, controlState, shiftKey, rect } = this
    if (controlState) {
      rectTransformer[(controlState + Number(shiftKey)) as Control]()
    }
    this.dispatchEvent({ type: 'transformed', rect })
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { rect } = this
    if (!rect) {
      return
    }
    const { frame, mouseShape, mouseState } = this
    /* 绘制外框 */
    frame.draw(ctx)
    mouseShape.draw(ctx, mouseState)
  }

  /* 暂存变换数据 */
  saveTransformData(rect: Rectangle) {
    const {
      clipMousePos,
      rectTransformer,
      frame,
      transformStage: { clipCenter, clipOpposite, parentPvmInvert }
    } = this
    const { parent } = rect
    if (parent) {
      parentPvmInvert.copy(parent.pvmMatrix.invert())
    }
    clipCenter.copy(frame.center)
    clipOpposite.copy(frame.opposite)
    rectTransformer.setOption({
      rect,
      mouseStart: clipMousePos.clone().applyMatrix3(parentPvmInvert)
    })
  }

  /* 设置旋转基点 */
  setRotateOrigin() {
    const {
      origin,
      rectTransformer,
      clipOrigin,
      transformStage: { clipCenter, parentPvmInvert }
    } = this
    // 图案基点在裁剪坐标系中的位置
    clipOrigin.copy(clipCenter)
    // 将图案中心点从裁剪坐标系转父级坐标系
    origin.copy(clipCenter.clone().applyMatrix3(parentPvmInvert))
    // 更新父级坐标系里基点到鼠标起点的向量
    rectTransformer.updateOriginToMouseStart()
  }

  /* 设置缩放基点 */
  setScaleOrigin() {
    const {
      altKey,
      origin,
      rectTransformer,
      clipOrigin,
      transformStage: { clipCenter, clipOpposite, parentPvmInvert }
    } = this
    // 根据altKey，将图案中心点或对点从裁剪坐标系转图案父级坐标系
    if (altKey) {
      clipOrigin.copy(clipCenter)
      origin.copy(clipCenter.clone().applyMatrix3(parentPvmInvert))
    } else {
      clipOrigin.copy(clipOpposite)
      origin.copy(clipOpposite.clone().applyMatrix3(parentPvmInvert))
    }
    // 更新父级坐标系里基点到鼠标起点的向量
    rectTransformer.updateOriginToMouseStart()
  }

  offsetRectByOrigin(rect: Rectangle) {
    const { offset, position, scale, rotate, pvmMatrix } = rect
    // 偏移量
    const curOffset = new Vector2().subVectors(
      offset,
      this.clipOrigin.clone().applyMatrix3(pvmMatrix.invert())
    )
    // 当前偏移和原有偏移的向量差
    const diff = new Vector2().subVectors(curOffset, offset)
    // 图案的offset需要基于curOffset 做反向偏移
    offset.copy(curOffset)
    // 上一级的position 再偏移回来，以确保图案的世界位不变
    position.sub(diff.multiply(scale).rotate(rotate))
  }

  pointerup() {
    if (this.controlState) {
      this.controlState = null
      this.dispatchEvent(_changeEvent)
    }
  }

  keydown(key: string, altKey: boolean, shiftKey: boolean) {
    this.shiftKey = shiftKey
    this.altKey = altKey
    if (this.rect) {
      switch (key) {
        case 'Escape':
          // 将选中图案时存储的图案变换数据controlStage 拷贝到图案中
          this.rectTransformer.copyRectData(this.controlStage)
          // 图案置空
          this.rect = null
          break
        case 'Enter':
          // 图案置空
          this.rect = null
          break
        case 'Delete':
          // 将img从其所在的group中删除
          this.rect.remove()
          // 图案置空
          this.rect = null
          break
      }
    }
    this.dispatchEvent(_changeEvent)
  }

  keyup(altKey: boolean, shiftKey: boolean) {
    this.shiftKey = shiftKey
    this.altKey = altKey
    this.dispatchEvent(_changeEvent)
  }
}
export { RectController }
