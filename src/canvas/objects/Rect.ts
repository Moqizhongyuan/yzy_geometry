import { Matrix3, Vector2 } from '../math'
import { Object2D } from '.'
import { crtPathByMatrix } from '../utils'

type RectType = {
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

  /* 绘图 */
  drawShape(ctx: CanvasRenderingContext2D) {
    const { offset, size } = this

    // 绘制矩形
    if (this.isStroke) {
      ctx.strokeRect(offset.x, offset.y, size.width, size.height)
    }
    if (this.isFill) {
      ctx.fillRect(offset.x, offset.y, size.width, size.height)
    }
  }

  /* 绘制图像边界 */
  crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmoMatrix) {
    const {
      size: { x: imgW, y: imgH }
    } = this
    crtPathByMatrix(ctx, [0, 0, imgW, 0, imgW, imgH, 0, imgH], matrix, true)
  }
}

export { Rectangle }
