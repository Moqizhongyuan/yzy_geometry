import { Camera } from './Camera'
import { BackgroundType, Group } from '../objects'
import { Background, Object2D } from '../objects'
import { Vector2 } from '../math'
import { Matrix3 } from '../math'

type SceneType = {
  canvas?: HTMLCanvasElement
  camera?: Camera
  autoClear?: boolean
}

class Scene extends Group {
  // canvas画布
  private _canvas = document.createElement('canvas')
  // canvas 上下文对象
  private ctx: CanvasRenderingContext2D = this._canvas.getContext(
    '2d'
  ) as CanvasRenderingContext2D
  // 相机
  camera = new Camera()
  // 是否自动清理画布
  autoClear = true
  // 类型
  readonly isScene = true
  // 子元素
  children: Array<Object2D>
  name: string = 'Scene'

  constructor(backgroundProp?: BackgroundType, attr: SceneType = {}) {
    super()
    this.setOption(attr)
    this.children = []
    if (backgroundProp) {
      const background = new Background(backgroundProp)
      background.parent = this
      this.add(background)
    }
  }
  get canvas() {
    return this._canvas
  }
  set canvas(value) {
    if (this._canvas === value) {
      return
    }
    this._canvas = value
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  /* 设置属性 */
  setOption(option: SceneType) {
    Object.assign(this, option)
  }

  /*  渲染 */
  render() {
    const {
      canvas: { width, height },
      ctx,
      camera,
      children,
      autoClear
    } = this
    ctx.save()
    // 清理画布
    if (autoClear) {
      ctx.clearRect(0, 0, width, height)
    }
    // 裁剪坐标系：将canvas坐标系的原点移动到canvas画布中心
    ctx.translate(width / 2, height / 2)
    // 渲染子对象
    for (const obj of children) {
      ctx.save()
      // 视图投影矩阵
      if (obj.enableCamera) {
        camera.transformInvert(ctx)
      }
      // 绘图
      obj.draw(ctx)
      ctx.restore()
    }
    ctx.restore()
  }

  /* client坐标转canvas坐标 */
  clientToCanvas(clientX: number, clientY: number) {
    const { canvas } = this
    const { left, top } = canvas.getBoundingClientRect()
    return new Vector2(clientX - left, clientY - top)
  }

  /* canvas坐标转裁剪坐标 */
  canvasToClip({ x, y }: Vector2) {
    const {
      canvas: { width, height }
    } = this
    return new Vector2(x - width / 2, y - height / 2)
  }

  /* client坐标转裁剪坐标 */
  clientToClip(clientX: number, clientY: number) {
    return this.canvasToClip(this.clientToCanvas(clientX, clientY))
  }

  /* 基于某个坐标系，判断某个点是否在图形内 */
  isPointInObj(obj: Object2D, mp: Vector2, matrix: Matrix3 = new Matrix3()) {
    const { ctx } = this
    ctx.beginPath()
    obj.crtPath(ctx, matrix)
    return ctx.isPointInPath(mp.x, mp.y)
  }
}
export { Scene }
