import { Rectangle } from '../geometry'
import { Matrix3 } from '../math'
import { Vector2 } from '../math'
import { crtPath, crtPathByMatrix } from '../utils'
import { Frame, IFrame, State } from '.'

const PI2 = Math.PI * 2

interface IRectFrame extends IFrame {
  rect?: Rectangle
}

/* 布尔变量 */
let _bool: boolean = false

/* 虚拟canvas上下文对象 */
const ctx = document
  .createElement('canvas')
  .getContext('2d') as CanvasRenderingContext2D

class RectFrame extends Frame {
  _rect = new Rectangle()

  constructor(attr: IRectFrame = {}) {
    super()
    Object.assign(this, attr)
  }

  get rect() {
    return this._rect
  }
  set rect(val) {
    this._rect = val
    this.updateShape()
  }

  /* 更新矩阵、路径初始顶点、中点 */
  updateShape() {
    const {
      vertices: fv,
      center,
      rect,
      level,
      rect: {
        size: { x: rectW, y: rectH }
      }
    } = this

    const vertices = [
      0,
      0,
      rectW / 2,
      0,
      rectW,
      0,
      rectW,
      rectH / 2,
      rectW,
      rectH,
      rectW / 2,
      rectH,
      0,
      rectH,
      0,
      rectH / 2
    ]

    /* 更新路径变换矩阵 */
    this.matrix = rect[level] as Matrix3
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
      rect: { size },
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
    ctx.arc(center.x, center.y, 5, 0, PI2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  getMouseState(mp: Vector2): State {
    const { vertices: fv } = this

    /* 对角线距离 */
    const diagonal = new Vector2(fv[0] - fv[8], fv[1] - fv[9]).length()

    /* 判断缩放的距离 */
    const scaleDist = Math.min(24, diagonal / 3)

    /* x,y缩放 */
    for (let i = 0, len = fv.length; i < len; i += 4) {
      if (new Vector2(fv[i], fv[i + 1]).sub(mp).length() < scaleDist) {
        const ind = (i + 8) % 16
        this.opposite.set(fv[ind], fv[ind + 1])
        return 'scale'
      }
    }

    /* y向缩放 */
    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[0], fv[1], fv[4], fv[5]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.opposite.set(fv[10], fv[11])
      return 'scaleY'
    }

    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[8], fv[9], fv[12], fv[13]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.opposite.set(fv[2], fv[3])
      return 'scaleY'
    }

    /* x向缩放 */
    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[12], fv[13], fv[0], fv[1]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.opposite.set(fv[6], fv[7])
      return 'scaleX'
    }

    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[4], fv[5], fv[8], fv[9]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.opposite.set(fv[14], fv[15])
      return 'scaleX'
    }

    /* 移动 */
    ctx.beginPath()
    crtPath(ctx, fv)
    if (ctx.isPointInPath(mp.x, mp.y)) {
      return 'move'
    }

    /* 旋转 */
    ctx.save()
    ctx.lineWidth = 80
    ctx.beginPath()
    crtPath(ctx, fv)
    ctx.closePath()
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      return 'rotate'
    }

    /* 无状态 */
    return null
  }
}
export { RectFrame }
