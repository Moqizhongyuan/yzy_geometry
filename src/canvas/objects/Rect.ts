import { Matrix3, Vector2 } from '../math'
import { Object2D, Object2DType } from '.'
import { crtPath, crtPathByMatrix } from '../utils'

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

  /* 绘图 */
  drawShape(ctx: CanvasRenderingContext2D) {
    const {
      offset: { x, y },
      size: { width, height }
    } = this
    // 绘制矩形
    if (this.isFill) {
      ctx.fillRect(x, y, width, height)
    }
    if (this.isStroke) {
      const vertices = [
        x,
        y,
        x + width,
        y,
        x + width,
        y + height,
        x,
        y + height
      ]
      for (let i = 0, len = vertices.length; i < len; i += 2) {
        const { x, y } = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(
          this.pvmMatrix
        )
        vertices[i] = x
        vertices[i + 1] = y
      }
      ctx.restore()
      ctx.save()
      ctx.lineWidth = 2
      crtPath(ctx, vertices, true)
      ctx.stroke()
      ctx.restore()
      ctx.save()
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
