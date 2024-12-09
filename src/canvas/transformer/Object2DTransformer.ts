import { Matrix3 } from '../math/Matrix3'
import { Vector2 } from '../math/Vector2'
import { Object2D } from '../objects/Object2D'

class Object2DTransformer {
  /* 本地变换数据 */
  localMatrix = new Matrix3()
  localRotate = 0
  localScale = new Vector2(1, 1)
  localPosition = new Vector2()

  /* 本地坐标系内的变换基点 */
  origin = new Vector2()

  /* 相对变换量 */
  relativePosition = new Vector2()
  relativeRotate = 0
  relativeScale = new Vector2(1, 1)

  /* 等量旋转时的旋转弧度 */
  uniformRotateAng = Math.PI / 12

  /* 基点变换后的矩阵 */
  get matrix() {
    const {
      relativePosition,
      relativeRotate,
      relativeScale,
      origin,
      localPosition,
      localScale,
      localRotate
    } = this
    const m2 = new Matrix3().makeTranslation(-origin.x, -origin.y)
    const m3 = new Matrix3()
      .scale(localScale.x * relativeScale.x, localScale.y * relativeScale.y)
      .rotate(localRotate + relativeRotate)
      .translate(
        localPosition.x + relativePosition.x,
        localPosition.y + relativePosition.y
      )
    return m3.clone().multiply(m2)
  }

  /* 设置基点 */
  setOrigin(localOrigin: Vector2) {
    this.origin.copy(localOrigin)
    this.localPosition.copy(localOrigin.clone().applyMatrix3(this.localMatrix))
  }

  /* 根据Object2D对象获取本地矩阵数据 */
  setLocalMatrixDataByObject2D(obj: Object2D) {
    this.localMatrix.copy(obj.matrix)
    this.localScale.copy(obj.scale)
    this.localRotate = obj.rotate
    this.localPosition.copy(obj.position)
  }

  /* 清理相对数据 */
  clearRelativeMatrixData() {
    this.relativePosition.set(0, 0)
    this.relativeRotate = 0
    this.relativeScale.set(1, 1)
  }

  /* 获取相对缩放量 */
  getRelativeScale(start2Origin: Vector2, end2Origin: Vector2) {
    const a = end2Origin.clone().rotate(-this.localRotate)
    const b = start2Origin.clone().rotate(-this.localRotate)
    return new Vector2(a.x / b.x, a.y / b.y)
  }

  /* 双向自由缩放 */
  scale0(start2Origin: Vector2, end2Origin: Vector2) {
    this.relativeScale.copy(this.getRelativeScale(start2Origin, end2Origin))
  }
  /* 双向等比缩放 */
  scale1(start2Origin: Vector2, end2Origin: Vector2) {
    const { x, y } = this.getRelativeScale(start2Origin, end2Origin)
    this.relativeScale.set((x + y) / 2)
  }

  /* 单向自由缩放 */
  scaleX0(start2Origin: Vector2, end2Origin: Vector2) {
    this.doScaleSingleDir('x', start2Origin, end2Origin)
  }
  scaleY0(start2Origin: Vector2, end2Origin: Vector2) {
    this.doScaleSingleDir('y', start2Origin, end2Origin)
  }
  doScaleSingleDir(dir: 'x' | 'y', start2Origin: Vector2, end2Origin: Vector2) {
    const s = this.getRelativeScale(start2Origin, end2Origin)
    this.relativeScale[dir] = s[dir]
  }
  /* 单向等比缩放 */
  scaleX1(start2Origin: Vector2, end2Origin: Vector2) {
    this.doUniformScaleSingleDir('x', start2Origin, end2Origin)
  }
  scaleY1(start2Origin: Vector2, end2Origin: Vector2) {
    this.doUniformScaleSingleDir('y', start2Origin, end2Origin)
  }
  doUniformScaleSingleDir(
    dir: 'x' | 'y',
    start2Origin: Vector2,
    end2Origin: Vector2
  ) {
    const s = this.getRelativeScale(start2Origin, end2Origin)
    this.relativeScale.set(s[dir])
  }

  /* 自由旋转 */
  rotate0(start2Origin: Vector2, end2Origin: Vector2) {
    this.relativeRotate = end2Origin.angle() - start2Origin.angle()
  }

  /* 等量旋转 */
  rotate1(start2Origin: Vector2, end2Origin: Vector2) {
    const { uniformRotateAng } = this
    const ang = end2Origin.angle() - start2Origin.angle()
    this.relativeRotate =
      Math.floor((ang + uniformRotateAng / 2) / uniformRotateAng) *
      uniformRotateAng
  }

  /* 自由移动 */
  move0(dragStart: Vector2, dragEnd: Vector2) {
    this.relativePosition.subVectors(dragEnd, dragStart)
  }

  /* 正交移动 */
  move1(dragStart: Vector2, dragEnd: Vector2) {
    // 作业
    this.relativePosition.subVectors(
      new Vector2(dragStart.x, 0),
      new Vector2(dragEnd.x, 0)
    )
  }
}
export { Object2DTransformer }
