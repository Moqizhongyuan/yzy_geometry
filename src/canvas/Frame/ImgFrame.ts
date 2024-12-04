import { Matrix3 } from '../math'
import { Vector2 } from '../math'
import { Img } from '../objects'
import { crtPath, crtPathByMatrix } from '../utils'
import { IFrame } from '.'
import { RectFrame } from '.'

const pi2 = Math.PI * 2

//参数类型
interface IImgFrame extends IFrame {
  img?: Img
}

class ImgFrame extends RectFrame {
  _img = new Img()

  constructor(attr: IImgFrame = {}) {
    super()
    Object.assign(this, attr)
  }

  get img() {
    return this._img
  }
  set img(val) {
    this._img = val
    this.updateShape()
  }

  /* 更新矩阵、路径初始顶点、中点 */
  updateShape() {
    const {
      vertices: fv,
      center,
      img,
      level,
      img: {
        size: { x: imgW, y: imgH }
      }
    } = this

    const vertices = [
      0,
      0,
      imgW / 2,
      0,
      imgW,
      0,
      imgW,
      imgH / 2,
      imgW,
      imgH,
      imgW / 2,
      imgH,
      0,
      imgH,
      0,
      imgH / 2
    ]

    /* 更新路径变换矩阵 */
    this.matrix = img[level] as Matrix3
    for (let i = 0, len = vertices.length; i < len; i += 2) {
      const { x, y } = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(
        this.matrix
      )
      /* 更新路径顶点 */
      fv[i] = x
      fv[i + 1] = y
    }
    /* 更新中点 */
    center.copy(new Vector2(fv[0], fv[1]).lerp(new Vector2(fv[8], fv[9]), 0.5))
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.updateShape()
    const {
      img: { size },
      vertices: fv,
      center,
      matrix,
      strokeStyle,
      fillStyle
    } = this

    /* 图案尺寸的一半 */
    const [halfWidth, halfHeight] = [size.width / 2, size.height / 2]

    /* 绘图 */
    ctx.save()
    ctx.strokeStyle = strokeStyle
    ctx.fillStyle = fillStyle

    /* 矩形框 */
    ctx.beginPath()
    crtPath(
      ctx,
      [fv[0], fv[1], fv[4], fv[5], fv[8], fv[9], fv[12], fv[13]],
      true
    )
    ctx.stroke()

    /* 矩形节点 */
    const { elements: e } = matrix
    // 矩阵内的缩放量
    const sx = new Vector2(e[0], e[1]).length()
    const sy = new Vector2(e[3], e[4]).length()
    // 节点尺寸，消去缩放量
    const pointSize = new Vector2(8 / sx, 8 / sy)
    const [w, h] = [pointSize.x / 2, pointSize.y / 2]

    // 绘制节点
    ctx.beginPath()
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (y === 1 && x === 1) {
          continue
        }
        const [bx, by] = [halfWidth * x, halfHeight * y]
        crtPathByMatrix(
          ctx,
          [bx - w, by - h, bx + w, by - h, bx + w, by + h, bx - w, by + h],
          matrix,
          true
        )
      }
    }
    ctx.fill()
    ctx.stroke()

    /* 中点 */
    ctx.beginPath()
    ctx.arc(center.x, center.y, 5, 0, pi2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
export { ImgFrame }
