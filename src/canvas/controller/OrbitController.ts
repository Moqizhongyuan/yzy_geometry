import { Vector2 } from '../math'
import { EventDispatcher } from '../core'
import { Camera } from '../core'

/* change 事件 */
const _changeEvent = { type: 'change' }

/* 暂存数据类型 */
type Stage = {
  cameraZoom: number
  cameraPosition: Vector2
  panStart: Vector2
}

/* 配置项 */
type Option = {
  camera?: Camera
  enableZoom?: boolean
  zoomSpeed?: number
  enablePan?: boolean
  panSpeed?: number
}

/* 相机轨道控制 */
class OrbitController extends EventDispatcher {
  // 相机
  camera: Camera
  // 允许缩放
  enableZoom = true
  // 缩放速度
  zoomSpeed = 3.0

  // 允许位移
  enablePan = true
  // 位移速度
  panSpeed = 1.0

  // 是否正在拖拽中
  panning = false

  //变换相机前的暂存数据
  stage: Stage = {
    cameraZoom: 1,
    cameraPosition: new Vector2(),
    panStart: new Vector2()
  }

  constructor(camera: Camera, option: Option = {}) {
    super()
    this.camera = camera
    this.setOption(option)
  }

  /* 设置属性 */
  setOption(option: Option) {
    Object.assign(this, option)
  }

  /* 缩放 */
  doScale(deltaY: number, origin?: Vector2) {
    const { enableZoom, camera, zoomSpeed } = this
    if (!enableZoom) {
      return
    }
    let scale = Math.pow(0.95, zoomSpeed)
    if (deltaY > 0) {
      scale = 1 / scale
    }
    camera.zoom *= scale
    if (origin) {
      const P1 = new Vector2().addVectors(origin, camera.position)
      const P2 = P1.clone().multiplyScalar(1 / scale)
      camera.position.add(P2.sub(P1))
    }
    this.dispatchEvent(_changeEvent)
  }

  /* 鼠标按下 */
  pointerdown(cx: number, cy: number) {
    const {
      enablePan,
      stage: { cameraPosition, panStart },
      camera: { position }
    } = this
    if (!enablePan) {
      return
    }
    this.panning = true
    cameraPosition.copy(position)
    panStart.set(cx, cy)
  }

  /* 鼠标抬起 */
  pointerup() {
    this.panning = false
  }

  /* 位移 */
  pointermove(cx: number, cy: number) {
    const {
      enablePan,
      camera: { position },
      stage: {
        panStart: { x, y },
        cameraPosition
      },
      panning
    } = this
    if (!enablePan || !panning) {
      return
    }
    position.copy(cameraPosition.clone().add(new Vector2(x - cx, y - cy)))
    this.dispatchEvent(_changeEvent)
  }
}

export { OrbitController }
