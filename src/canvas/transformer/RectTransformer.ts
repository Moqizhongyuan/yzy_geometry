import { Rectangle } from '../objects'
import { Vector2 } from '../math'
import { ImgTransformer } from './ImgTransformer'
export type RectData = {
  position: Vector2
  scale: Vector2
  rotate: number
  offset: Vector2
}
type RectTransformerType = {
  rect?: Rectangle
  origin?: Vector2
  mousePos?: Vector2
  mouseStart?: Vector2
  uniformRotateAng?: number
}
class RectTransformer extends ImgTransformer {
  private rect: Rectangle = new Rectangle()
  constructor(attr: RectTransformerType = {}) {
    super()
    this.setOption(attr)
  }
  setOption(attr: RectTransformerType = {}) {
    Object.assign(this, attr)
    const { rect, mouseStart, origin } = attr
    if (rect) {
      this.passRectDataTo()
    }
    if (origin || mouseStart) {
      this.updateOriginToMouseStart(mouseStart, origin)
    }
  }
  passRectDataTo(obj: RectData = this) {
    const { position, scale, rotate, offset } = this.rect
    obj.position.copy(position)
    obj.scale.copy(scale)
    obj.rotate = rotate
    obj.offset.copy(offset)
  }
  updateOriginToMouseStart(mouseStart = this.mouseStart, origin = this.origin) {
    this.originToMouseStart.subVectors(mouseStart, origin)
  }
  copyRectData(obj: RectData) {
    const { position, scale, rotate, offset } = obj
    const { rect } = this
    if (rect) {
      rect.position.copy(position)
      rect.scale.copy(scale)
      rect.rotate = rotate
      rect.offset.copy(offset)
    }
  }
  restoreRect() {
    this.copyRectData(this)
  }
  scale0() {
    const { rect, scale } = this
    rect.scale.copy(scale.clone().multiply(this.getLocalScale()))
  }
  getLocalScale() {
    const { rect, origin, originToMouseStart, mousePos } = this
    const rotateInvert = -rect.rotate
    return mousePos
      .clone()
      .sub(origin)
      .rotate(rotateInvert)
      .divide(originToMouseStart.clone().rotate(rotateInvert))
  }
  scale1() {
    const { rect, scale } = this
    const s = this.getLocalScale()
    rect.scale.copy(scale.clone().multiplyScalar((s.x + s.y) / 2))
  }
  doScaleSingleDir(dir: 'x' | 'y') {
    const { rect, scale } = this
    const s = this.getLocalScale()
    rect.scale[dir] = scale[dir] * s[dir]
  }
  doUniformScaleSingleDir(dir: 'x' | 'y') {
    const { rect, scale } = this
    const s = this.getLocalScale()
    rect.scale.copy(scale.clone().multiplyScalar(s[dir]))
  }
  rotate0() {
    const { rect, rotate, origin, originToMouseStart, mousePos } = this
    rect.rotate =
      rotate + mousePos.clone().sub(origin).angle() - originToMouseStart.angle()
  }
  rotate1() {
    const {
      rect,
      rotate,
      origin,
      originToMouseStart,
      mousePos,
      uniformRotateAng
    } = this
    const ang =
      mousePos.clone().sub(origin).angle() - originToMouseStart.angle()
    rect.rotate =
      rotate +
      Math.floor((ang + uniformRotateAng / 2) / uniformRotateAng) *
        uniformRotateAng
  }
  move0() {
    const { rect, position, mouseStart, mousePos } = this
    rect.position.copy(position.clone().add(mousePos.clone().sub(mouseStart)))
  }
  doMoveSingleDir(dir: 'x' | 'y') {
    const { rect, mousePos, mouseStart, position } = this
    rect.position[dir] = position[dir] + mousePos[dir] - mouseStart[dir]
  }
}
export { RectTransformer }
