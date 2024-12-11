import { Vector2 } from '../math/Vector2'
import { Object2D } from '../objects/Object2D'
import { Matrix3 } from '../math/Matrix3'
import { MouseShape } from './MouseShape'
import { ControlFrame, State } from '../frame'
import { Object2DTransformer } from '../transformer'

type TransformKey =
  | 'scale0'
  | 'scale1'
  | 'scaleX0'
  | 'scaleY0'
  | 'scaleY0'
  | 'scaleY1'
  | 'rotate0'
  | 'rotate1'
  | 'move0'
  | 'move1'

type TransformData = {
  position: Vector2
  rotate: number
  scale: Vector2
}

// change 事件
const _changeEvent = { type: 'change' }

class TransformController extends Object2D {
  // 要控制的Object2D对象
  _obj: Object2D | null = null
  // 图案控制框
  frame = new ControlFrame()
  // 鼠标状态
  mouseState: State = null
  // 鼠标的裁剪坐标位
  clipMousePos = new Vector2()
  // 鼠标图案
  mouseShape = new MouseShape({
    vertices: this.frame.clipVertices,
    center: this.frame.clipCenter,
    mousePos: this.clipMousePos
  })
  // 渲染顺序
  index = Infinity
  // 不受相机影响
  enableCamera = false

  // 控制状态
  controlState: State = null

  // 拖拽起始位与结束位
  dragStart = new Vector2()
  dragEnd = new Vector2()

  //拖拽起始位减基点
  start2Origin = new Vector2()
  //拖拽结束位减基点
  end2Origin = new Vector2()

  // alt 键是否按下
  _altKey = false
  // shift 键是否按下
  shiftKey = false

  /* 变换器 */
  transformer = new Object2DTransformer()

  // 父级pvm逆矩阵
  parentPvmInvert = new Matrix3()

  // 选中图案时的暂存数据，用于取消变换
  controlStage: TransformData = {
    position: new Vector2(),
    scale: new Vector2(1, 1),
    rotate: 0
  }

  get obj() {
    return this._obj
  }
  set obj(val) {
    if (this._obj === val) {
      return
    }
    this._obj = val
    if (val) {
      this.frame.obj = val
      this.saveTransformData()
      this.transformer.setLocalMatrixDataByObject2D(val)
      this.dispatchEvent({ type: 'selected', obj: val })
    } else {
      this.mouseState = null
      this.controlState = null
    }
    this.dispatchEvent(_changeEvent)
  }

  get altKey() {
    return this._altKey
  }
  set altKey(val) {
    if (this._altKey === val) {
      return
    }
    this._altKey = val
    const { controlState } = this
    if (controlState) {
      // 清理相对变换
      this.transformer.clearRelativeMatrixData()
      // 重置基点
      this.setOrigin()
      // 设置起点到基点向量
      this.start2Origin.subVectors(
        this.dragStart,
        this.transformer.localPosition
      )
      // 终点到基点的向量
      this.end2Origin.subVectors(this.dragEnd, this.transformer.localPosition)
      // 重新变换
      this.relativeTransform(controlState)
    }

    this.dispatchEvent(_changeEvent)
  }

  /* 鼠标按下 */
  pointerdown(obj: Object2D | null, mp: Vector2) {
    if (!this.mouseState) {
      this.obj = obj
      if (!obj) {
        return
      }
    }
    // 更新鼠标裁剪坐标位
    this.clipMousePos.copy(mp)
    // 获取鼠标状态
    this.mouseState = this.frame.getMouseState(mp)
    // 更新parentPvmInvert
    const pvmInvert = this.obj?.parent?.pvmMatrix.invert()
    if (pvmInvert) {
      this.parentPvmInvert.copy(pvmInvert)
    }

    if (this.mouseState) {
      // 拖拽起始位(图案父级坐标系)
      this.dragStart.copy(mp.clone().applyMatrix3(this.parentPvmInvert))
      // 控制状态等于鼠标状态
      this.controlState = this.mouseState
      // 设置本地矩阵数据
      if (this.obj) {
        this.transformer.setLocalMatrixDataByObject2D(this.obj)
      }
      // 设置基点
      this.setOrigin()
      // 设置起点到基点向量
      this.start2Origin.subVectors(
        this.dragStart,
        this.transformer.localPosition
      )
    }
    this.dispatchEvent(_changeEvent)
  }

  /* 鼠标移动 */
  pointermove(mp: Vector2) {
    if (!this.obj) {
      return
    }
    const {
      end2Origin,
      dragEnd,
      clipMousePos,
      controlState,
      frame,
      transformer: { localPosition }
    } = this
    // 更新鼠标裁剪坐标位
    clipMousePos.copy(mp)

    if (controlState) {
      dragEnd.copy(mp.clone().applyMatrix3(this.parentPvmInvert))
      end2Origin.subVectors(dragEnd, localPosition)
      this.relativeTransform(controlState)
    } else {
      // 获取鼠标状态
      this.mouseState = frame.getMouseState(mp)
    }

    this.dispatchEvent(_changeEvent)
  }

  /* 鼠标抬起 */
  pointerup() {
    const { obj, controlState, transformer } = this
    if (!obj || !controlState) {
      return
    }
    transformer.setLocalMatrixDataByObject2D(obj)
    transformer.clearRelativeMatrixData()
    this.controlState = null
    this.dispatchEvent(_changeEvent)
  }

  /* 键盘按下 */
  keydown(key: string, altKey: boolean, shiftKey: boolean) {
    this.shiftKey = shiftKey
    this.altKey = altKey
    if (this.obj) {
      switch (key) {
        case 'Escape':
          // 将选中图案时存储的图案变换数据controlStage 拷贝到图案中
          this.cancelTransform()
          // 图案置空
          this.obj = null
          break
        case 'Enter':
          // 图案置空
          this.obj = null
          break
        case 'Delete':
          this.obj.remove()
          this.obj = null
          break
      }
    }
    this.dispatchEvent(_changeEvent)
  }

  /* 键盘抬起 */
  keyup(altKey: boolean, shiftKey: boolean) {
    this.shiftKey = shiftKey
    this.altKey = altKey
    this.dispatchEvent(_changeEvent)
  }

  /* 相对变换 */
  relativeTransform(controlState: string) {
    const { transformer, start2Origin, dragStart, dragEnd, end2Origin, obj } =
      this
    const key = (controlState + Number(this.shiftKey)) as TransformKey
    if (!obj || !transformer[key]) {
      return
    }
    if (controlState === 'move') {
      transformer[key](dragStart, dragEnd)
    } else {
      transformer[key](start2Origin, end2Origin)
    }
    this.dispatchEvent({ type: 'transformed', obj })
  }

  /*  设置基点(图案父级坐标系) */
  setOrigin() {
    const {
      altKey,
      controlState,
      frame: { localCenter, localOpposite },
      transformer
    } = this
    const curOrigin =
      altKey || controlState === 'rotate' ? localCenter : localOpposite
    transformer.setOrigin(curOrigin)
  }

  /* 存储本地模型矩阵的变换数据 */
  saveTransformData() {
    const { obj, controlStage } = this
    if (obj) {
      this.passTransformData(obj, controlStage)
    }
  }

  /* 取消变换，恢复图形变换前的状态 */
  cancelTransform() {
    const { obj, controlStage } = this
    if (obj) {
      this.passTransformData(controlStage, obj)
    }
  }

  /* 把一个对象的变换数据传递给另一个对象 */
  passTransformData(obj0: TransformData, obj1: TransformData) {
    const { position, scale, rotate } = obj0
    obj1.position.copy(position)
    obj1.scale.copy(scale)
    obj1.rotate = rotate
  }

  /* 绘图 */
  draw(ctx: CanvasRenderingContext2D) {
    const { obj } = this
    if (!obj) {
      return
    }
    const { frame, mouseShape, mouseState, controlState, transformer } = this

    // 设置本地模型矩阵
    if (controlState) {
      obj.decomposeModelMatrix(transformer.matrix)
    }

    /* 绘制外框 */
    frame.draw(ctx)
    /* 绘制鼠标图案 */
    mouseShape.draw(ctx, mouseState)
  }
}

export { TransformController }
