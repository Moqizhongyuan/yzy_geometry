import { Vector2 } from '../math'
import { Img } from '../objects'

/* PI*2 */
const PI2 = Math.PI * 2

/* 图案数据类型 */
export type ImgData = {
  position: Vector2
  scale: Vector2
  rotate: number
  offset: Vector2
}

export type Control =
  | 'scale0'
  | 'scale1'
  | 'scaleX0'
  | 'scaleX1'
  | 'scaleY0'
  | 'scaleY1'
  | 'rotate0'
  | 'rotate1'
  | 'move0'
  | 'move1'

type ImgTransformerType = {
  img?: Img
  origin?: Vector2
  mousePos?: Vector2
  mouseStart?: Vector2
  uniformRotateAng?: number
}

class ImgTransformer {
  /* 变换图案 */
  img = new Img()

  /* 暂存图案的变换信息 */
  position = new Vector2()
  scale = new Vector2(1, 1)
  rotate = 0
  offset = new Vector2()

  /* 图案的变换基点 */
  origin = new Vector2()

  /* 图案父级坐标系里的鼠标数据 */
  // 鼠标位置
  mousePos = new Vector2()
  // 鼠标起始位
  mouseStart = new Vector2()
  // mouseStart减origin
  originToMouseStart = new Vector2()

  /* 等量旋转时的旋转弧度 */
  uniformRotateAng = PI2 / 24

  constructor(attr: ImgTransformerType = {}) {
    this.setOption(attr)
  }

  /* 设置属性 */
  setOption(attr: ImgTransformerType = {}) {
    Object.assign(this, attr)
    const { img, mouseStart, origin } = attr
    if (img) {
      this.passImgDataTo()
    }
    if (origin || mouseStart) {
      this.updateOriginToMouseStart(mouseStart, origin)
    }
  }

  /* 变换基点到鼠标起点的向量 */
  updateOriginToMouseStart(mouseStart = this.mouseStart, origin = this.origin) {
    this.originToMouseStart.subVectors(mouseStart, origin)
  }

  /* 把img变换数据传递给obj */
  passImgDataTo(obj: ImgData = this) {
    const { position, scale, rotate, offset } = this.img
    obj.position.copy(position)
    obj.scale.copy(scale)
    obj.rotate = rotate
    obj.offset.copy(offset)
  }

  /* 将图案回退到变换之前的状态 */
  restoreImg() {
    this.copyImgData(this)
  }

  // 将obj中的变换数据拷贝到img中
  copyImgData(obj: ImgData) {
    const { position, scale, rotate, offset } = obj
    const { img } = this
    if (img) {
      img.position.copy(position)
      img.scale.copy(scale)
      img.rotate = rotate
      img.offset.copy(offset)
    }
  }

  /* 双向缩放 */
  scale0() {
    const { img, scale } = this
    img.scale.copy(scale.clone().multiply(this.getLocalScale()))
  }
  /* 获取图案本地的缩放量 */
  getLocalScale() {
    const { img, origin, originToMouseStart, mousePos } = this
    const rotateInvert = -img.rotate
    return mousePos
      .clone()
      .sub(origin)
      .rotate(rotateInvert)
      .divide(originToMouseStart.clone().rotate(rotateInvert))
  }

  /* 双向等比缩放 */
  scale1() {
    const { img, scale } = this
    const s = this.getLocalScale()
    img.scale.copy(scale.clone().multiplyScalar((s.x + s.y) / 2))
  }

  /* 单向缩放 */
  scaleX0() {
    this.doScaleSingleDir('x')
  }
  scaleY0() {
    this.doScaleSingleDir('y')
  }
  doScaleSingleDir(dir: 'x' | 'y') {
    const { img, scale } = this
    const s = this.getLocalScale()
    img.scale[dir] = scale[dir] * s[dir]
  }
  /* 单向等比缩放 */
  scaleX1() {
    this.doUniformScaleSingleDir('x')
  }
  scaleY1() {
    this.doUniformScaleSingleDir('y')
  }
  doUniformScaleSingleDir(dir: 'x' | 'y') {
    const { img, scale } = this
    const s = this.getLocalScale()
    img.scale.copy(scale.clone().multiplyScalar(s[dir]))
  }

  /* 旋转 */
  rotate0() {
    const { img, rotate, origin, originToMouseStart, mousePos } = this
    img.rotate =
      rotate + mousePos.clone().sub(origin).angle() - originToMouseStart.angle()
  }

  /* 等量旋转 */
  rotate1() {
    const {
      img,
      rotate,
      origin,
      originToMouseStart,
      mousePos,
      uniformRotateAng
    } = this
    const ang =
      mousePos.clone().sub(origin).angle() - originToMouseStart.angle()
    img.rotate =
      rotate +
      Math.floor((ang + uniformRotateAng / 2) / uniformRotateAng) *
        uniformRotateAng
  }

  /* 位移 */
  // 自由位移
  move0() {
    const { img, position, mouseStart, mousePos } = this
    img.position.copy(position.clone().add(mousePos.clone().sub(mouseStart)))
  }

  // 正交位移-作业，留给同学们实现
  move1() {
    this.doMoveSingleDir('x')
  }

  doMoveSingleDir(dir: 'x' | 'y') {
    const { img, mousePos, mouseStart, position } = this
    img.position[dir] = position[dir] + mousePos[dir] - mouseStart[dir]
  }
}
export { ImgTransformer }
