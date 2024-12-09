import { Vector2 } from '../math/Vector2'
import { BasicStyle, BasicStyleType } from '../style/BasicStyle'
import { Object2D, Object2DType } from './Object2D'
import { crtPathByMatrix } from '../utils'

type ImgType = Object2DType & {
  image?: CanvasImageSource
  offset?: Vector2
  size?: Vector2
  view?: View | undefined
  src?: string
  style?: BasicStyleType
}

type View = {
  x: number
  y: number
  width: number
  height: number
}

class Img extends Object2D {
  image: CanvasImageSource = new Image()
  offset: Vector2 = new Vector2()
  size: Vector2 = new Vector2(300, 150)
  view: View | undefined
  style: BasicStyle = new BasicStyle()

  // 类型
  readonly isImg = true

  constructor(attr: ImgType = {}) {
    super()
    this.setOption(attr)
  }

  /* 属性设置 */
  setOption(attr: ImgType) {
    for (const [key, val] of Object.entries(attr)) {
      switch (key) {
        case 'src':
          if (this.image instanceof Image) {
            this.image.src = val as string
          }
          break
        case 'style':
          this.style.setOption(val as BasicStyleType)
          break
        default:
          this[key] = val
      }
    }
  }

  /* 绘图 */
  drawShape(ctx: CanvasRenderingContext2D) {
    const { image, offset, size, view, style } = this

    //样式
    style.apply(ctx)

    // 绘制图像
    if (view) {
      ctx.drawImage(
        image,
        view.x,
        view.y,
        view.width,
        view.height,
        offset.x,
        offset.y,
        size.x,
        size.y
      )
    } else {
      ctx.drawImage(image, offset.x, offset.y, size.x, size.y)
    }
  }

  /* 绘制图像边界 */
  crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmMatrix) {
    // this.computeBoundingBox()
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

export { Img }
