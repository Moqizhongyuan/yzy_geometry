import { Vector2 } from '../math/Vector2'
import { BasicStyle, BasicStyleType } from '../style/BasicStyle'
import { Object2DType } from './Object2D'
import { crtPathByMatrix } from '../utils'
import { Rectangle } from '../geometry'

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

class Img extends Rectangle {
  image: CanvasImageSource = new Image()
  view: View | undefined
  style: BasicStyle = new BasicStyle()

  // 类型
  readonly isImg = true

  constructor(attr: ImgType = {}) {
    super(attr)
    this.setOption(attr)
  }

  /* 属性设置 */
  setOption(attr: ImgType) {
    for (const [key, val] of Object.entries(attr)) {
      switch (key) {
        case 'src':
          if (this.image instanceof Image) {
            this.image.src = val as 'string'
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
  crtPath(ctx: CanvasRenderingContext2D, matrix = this.pvmoMatrix) {
    const {
      size: { x: imgW, y: imgH }
    } = this
    crtPathByMatrix(ctx, [0, 0, imgW, 0, imgW, imgH, 0, imgH], matrix, true)
  }
}

export { Img }
