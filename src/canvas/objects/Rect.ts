import { Vector2 } from '../math'
import { Object2D, Object2DType } from '.'
import { crtPath, crtPathByMatrix } from '../utils'
import { StandStyle, StandStyleType, BasicStyleType } from '../style'

type RectType = Object2DType & {
  offset?: Vector2
  size?: Vector2
  style?: StandStyleType
}

class Rectangle extends Object2D {
  offset: Vector2 = new Vector2()
  size: Vector2 = new Vector2(300, 150)
  style: StandStyle = new StandStyle()
  enableCamera: boolean = false
  name: string = 'Rectangle'

  constructor(attr: RectType = {}) {
    super()
    this.setOption(attr)
  }

  /* 属性设置 */
  setOption(attr: RectType) {
    for (const [key, val] of Object.entries(attr)) {
      switch (key) {
        case 'style':
          this.style.setOption(val as BasicStyleType)
          break
        default:
          this[key] = val
      }
    }
  }

  /* 绘图 */
  draw(ctx: CanvasRenderingContext2D): void {
    this.computeBoundingBox()
    const {
      boundingBox: {
        min: { x: x0, y: y0 },
        max: { x: x1, y: y1 }
      },
      style
    } = this
    const lv = [x0, y0, x0, y1, x1, y1, x1, y0]
    for (let i = 0, len = lv.length; i < len; i += 2) {
      const { x, y } = new Vector2(lv[i], lv[i + 1]).applyMatrix3(this.matrix)
      lv[i] = x
      lv[i + 1] = y
    }
    ctx.save()
    style.apply(ctx)
    ctx.beginPath()
    crtPath(ctx, lv, true)
    ctx.stroke()
    if (this.fillStyle) {
      this.transform(ctx)
      ctx.fill()
    }
    ctx.closePath()

    ctx.restore()
  }

  /* 绘制图像边界 */
  crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmMatrix) {
    const {
      boundingBox: {
        min: { x: x0, y: y0 },
        max: { x: x1, y: y1 }
      }
    } = this
    crtPathByMatrix(ctx, [x0, y0, x1, y0, x1, y1, x0, y1], matrix)
  }

  /* 计算边界盒子 */
  computeBoundingBox() {
    const {
      boundingBox: { min, max },
      size,
      offset
    } = this
    min.copy(offset)
    max.addVectors(offset, size)
  }
}

export { Rectangle }
