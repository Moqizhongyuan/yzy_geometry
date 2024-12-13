import { Vector2 } from '../math'
import { Object2D, Object2DType } from '.'
import { crtPathByMatrix } from '../utils'
import { StandStyle, StandStyleType, BasicStyleType } from '../style'

type CircleType = Object2DType & {
  offset?: Vector2
  size?: Vector2
  style?: StandStyleType
}

class Circle extends Object2D {
  offset: Vector2 = new Vector2()
  size: Vector2 = new Vector2(300, 300)
  style: StandStyle = new StandStyle()
  enableCamera: boolean = false
  name: string = 'Circle'

  constructor(attr: CircleType = {}) {
    super()
    this.setOption(attr)
  }

  /* 属性设置 */
  setOption(attr: CircleType) {
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
    const lv = [x0, y0, x0, y1, x1, y1]
    for (let i = 0, len = lv.length; i < len; i += 2) {
      const { x, y } = new Vector2(lv[i], lv[i + 1]).applyMatrix3(this.matrix)
      lv[i] = x
      lv[i + 1] = y
    }
    ctx.save()
    style.apply(ctx)
    ctx.beginPath()
    const { x, y } = new Vector2(lv[0], lv[1]).lerp(
      new Vector2(lv[4], lv[5]),
      0.5
    )
    const radiusX =
      new Vector2(lv[2], lv[3]).sub(new Vector2(lv[4], lv[5])).length() / 2 // x 轴方向的半径
    const radiusY =
      new Vector2(lv[0], lv[1]).sub(new Vector2(lv[2], lv[3])).length() / 2 // y 轴方向的半径
    const rotation = this.rotate // 椭圆的旋转角度
    const startAngle = 0 // 起始角度
    const endAngle = 2 * Math.PI // 结束角度
    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
    ctx.stroke()
    if (this.fillStyle) {
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

export { Circle }
