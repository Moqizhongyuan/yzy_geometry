import { Matrix3 } from '../math'
import { Vector2 } from '../math'
import { Object2D } from '../objects'
import { crtPath, crtPathByMatrix } from '../utils'

const PI2 = Math.PI * 2

export type State = 'scale' | 'scaleX' | 'scaleY' | 'rotate' | 'move' | null
type Level = 'worldMatrix' | 'pvmMatrix'

let _bool: boolean = false

const ctx = document
  .createElement('canvas')
  .getContext('2d') as CanvasRenderingContext2D

type ControlFrameType = {
  obj?: Object2D
  level?: Level
}

class ControlFrame {
  // 目标对象
  _obj = new Object2D()
  // 图案本地坐标系内的边框的顶点集合
  localVertices: number[] = []
  // 图案裁剪坐标系的边框的顶点集合
  clipVertices: number[] = []
  // 当前节点索引
  nodeIndex = 0
  // 本地坐标系中的中点
  localCenter = new Vector2()
  // 裁剪坐标系中的中点
  clipCenter = new Vector2()
  // 路径变换矩阵
  matrix = new Matrix3()

  level: Level = 'pvmMatrix'

  // 描边色
  strokeStyle = '#558ef0'
  // 填充色
  fillStyle = '#fff'

  constructor(attr: ControlFrameType = {}) {
    Object.assign(this, attr)
  }

  get obj() {
    return this._obj
  }
  set obj(val) {
    this._obj = val
    val.computeBoundingBox()
    this.updateVertices()
  }

  /* 获取对面节点 */
  get localOpposite(): Vector2 {
    return this.getOpposite('localVertices')
  }
  get clipOpposite(): Vector2 {
    return this.getOpposite('clipVertices')
  }
  getOpposite(type: 'localVertices' | 'clipVertices') {
    const { nodeIndex } = this
    const vertices = this[type]
    const ind = (nodeIndex + 8) % 16
    return new Vector2(vertices[ind], vertices[ind + 1])
  }

  /* 更新localVertices和clipVertices*/
  updateVertices() {
    const {
      clipVertices: cv,
      localCenter,
      clipCenter,
      obj,
      level,
      obj: {
        boundingBox: {
          min: { x: x0, y: y0 },
          max: { x: x1, y: y1 }
        }
      }
    } = this

    const xm = (x0 + x1) / 2
    const ym = (y0 + y1) / 2

    this.localVertices = [
      x0,
      y0,
      xm,
      y0,
      x1,
      y0,
      x1,
      ym,
      x1,
      y1,
      xm,
      y1,
      x0,
      y1,
      x0,
      ym
    ]
    const lv = this.localVertices
    this.matrix = obj[level]
    for (let i = 0, len = lv.length; i < len; i += 2) {
      const { x, y } = new Vector2(lv[i], lv[i + 1]).applyMatrix3(this.matrix)
      cv[i] = x
      cv[i + 1] = y
    }
    localCenter.copy(
      new Vector2(lv[0], lv[1]).lerp(new Vector2(lv[8], lv[9]), 0.5)
    )
    clipCenter.copy(
      new Vector2(cv[0], cv[1]).lerp(new Vector2(cv[8], cv[9]), 0.5)
    )
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.updateVertices()
    const {
      obj: {
        size,
        offset: { x: ox, y: oy }
      },
      clipVertices: fv,
      clipCenter,
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
    crtPath(ctx, [fv[0], fv[1], fv[4], fv[5], fv[8], fv[9], fv[12], fv[13]])
    ctx.closePath()
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
          [
            ox + bx - w,
            oy + by - h,
            ox + bx + w,
            oy + by - h,
            ox + bx + w,
            oy + by + h,
            ox + bx - w,
            oy + by + h
          ],
          matrix,
          true
        )
      }
    }
    ctx.fill()
    ctx.stroke()

    /* 中点 */
    ctx.beginPath()
    ctx.arc(clipCenter.x, clipCenter.y, 5, 0, PI2)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  /* 获取变换状态 */
  getMouseState(mp: Vector2): State {
    const { clipVertices: fv } = this

    /* 对角线距离 */
    const diagonal = new Vector2(fv[0] - fv[8], fv[1] - fv[9]).length()

    /* 判断缩放的距离 */
    const scaleDist = Math.min(24, diagonal / 3)

    /* x,y缩放 */
    for (let i = 0, len = fv.length; i < len; i += 4) {
      if (new Vector2(fv[i], fv[i + 1]).sub(mp).length() < scaleDist) {
        this.nodeIndex = i
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
      this.nodeIndex = 2
      return 'scaleY'
    }

    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[8], fv[9], fv[12], fv[13]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.nodeIndex = 10
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
      this.nodeIndex = 14
      return 'scaleX'
    }

    ctx.save()
    ctx.lineWidth = scaleDist
    ctx.beginPath()
    crtPath(ctx, [fv[4], fv[5], fv[8], fv[9]])
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      this.nodeIndex = 6
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
    crtPath(ctx, fv, true)
    _bool = ctx.isPointInStroke(mp.x, mp.y)
    ctx.restore()
    if (_bool) {
      return 'rotate'
    }

    /* 无状态 */
    return null
  }
}
export { ControlFrame }
