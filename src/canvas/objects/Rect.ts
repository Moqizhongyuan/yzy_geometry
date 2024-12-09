import { Matrix3, Vector2 } from '../math'
import { Object2D, Object2DType } from '.'
import { Camera } from '@canvas/core'

type RectType = Object2DType & {
  offset?: Vector2
  size?: Vector2
  isFill?: boolean
  isStroke?: boolean
}

class Rectangle extends Object2D {
  offset: Vector2 = new Vector2()
  size: Vector2 = new Vector2(300, 150)
  isFill: boolean = false
  isStroke: boolean = true
  enableCamera = false

  // 类型
  readonly isImg = true

  constructor(attr: RectType = {}) {
    super()
    this.setOption(attr)
  }

  /* 属性设置 */
  setOption(attr: RectType) {
    Object.assign(this, attr)
  }

  /* 世界模型矩阵*偏移矩阵 */
  get moMatrix(): Matrix3 {
    const {
      offset: { x, y }
    } = this
    return this.worldMatrix.multiply(new Matrix3().makeTranslation(x, y))
  }

  /* 视图投影矩阵*世界模型矩阵*偏移矩阵  */
  get pvmoMatrix(): Matrix3 {
    const {
      offset: { x, y }
    } = this
    return this.pvmMatrix.multiply(new Matrix3().makeTranslation(x, y))
  }

  draw(ctx: CanvasRenderingContext2D, camera: Camera): void {}

  /* 绘制图像边界 */
  crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmMatrix) {}
}

export { Rectangle }
