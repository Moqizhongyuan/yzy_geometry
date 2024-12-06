import { Vector2 } from '../math'
import { Group } from './Group'
import { Camera, Scene } from '../core'
import { EventDispatcher } from '../core'
import { Matrix3 } from '../math'
import { generateUUID } from '../utils'

export type Object2DType = {
  position?: Vector2
  rotate?: number
  scale?: Vector2
  visible?: boolean
  index?: number
  name?: string
  parent?: Scene | Group | undefined
  enableCamera?: boolean
  [key: string]: unknown
}

class Object2D extends EventDispatcher {
  // 自定义属性
  [key: string]: unknown
  // 位置
  position = new Vector2()
  // 旋转
  rotate = 0
  // 缩放
  scale = new Vector2(1, 1)
  // 可见性
  visible = true
  // 渲染顺序
  index = 0
  // 名称
  name = ''
  // 父级
  parent: Scene | Group | undefined
  // 是否受相机影响-只适用于Scene的children元素
  enableCamera = true
  // UUID
  uuid = generateUUID()

  strokeStyle: string = 'black'

  fillStyle: string = 'black'

  layerNum: number = 0

  // 类型
  readonly isObject2D = true

  /* 本地模型矩阵 */
  get matrix(): Matrix3 {
    const { position, rotate, scale } = this
    return new Matrix3()
      .scale(scale.x, scale.y)
      .rotate(rotate)
      .translate(position.x, position.y)
  }

  /* 世界模型矩阵 */
  get worldMatrix(): Matrix3 {
    const { parent, matrix } = this
    if (parent) {
      return parent.worldMatrix.multiply(matrix)
    } else {
      return matrix
    }
  }

  /* pvm 投影视图模型矩阵 */
  get pvmMatrix(): Matrix3 {
    const scene = this.getScene()
    if (scene) {
      const { camera } = scene
      return new Matrix3().multiplyMatrices(camera.pvMatrix, this.worldMatrix)
    } else {
      return this.worldMatrix
    }
  }

  /* 总缩放量 */
  get worldScale(): Vector2 {
    const { scale, parent } = this
    if (parent) {
      return scale.clone().multiply(parent.worldScale)
    } else {
      return scale
    }
  }

  /* 先变换(缩放+旋转)后位移 */
  transform(ctx: CanvasRenderingContext2D) {
    const { position, rotate, scale } = this
    ctx.translate(position.x, position.y)
    ctx.rotate(rotate)
    ctx.scale(scale.x, scale.y)
  }

  /* 从父级中删除自身 */
  remove(obj?: Object2D) {
    const { parent } = this
    if (parent && !obj) {
      parent.remove(this)
    }
  }

  /* 获取场景 */
  getScene(): Scene | null {
    if ('isScene' in this) {
      return this as unknown as Scene
    } else if (this.parent) {
      return this.parent.getScene()
    } else {
      return null
    }
  }

  /* 绘图 */
  draw(ctx: CanvasRenderingContext2D, _camera?: Camera) {
    if (!this.visible) {
      return
    }
    ctx.save()
    /*  矩阵变换 */
    this.transform(ctx)
    /* 绘制图形 */
    this.drawShape(ctx, _camera)
    ctx.restore()
  }

  /* 绘制图形-接口 */
  drawShape(ctx: CanvasRenderingContext2D, _camera?: Camera) {
    console.log(ctx)
  }

  /* 创建路径-接口 */
  crtPath(ctx: CanvasRenderingContext2D, projectionMatrix: Matrix3) {
    console.log(ctx, projectionMatrix)
  }
}

export { Object2D }
