import { Scene } from '.'
import { Img } from '../objects'
import { Vector2 } from '../math'
import { ImagePromise } from '../utils'
import { queueScene } from '@canvas/nextTicks'

/* 图案数据类型 */
type Img2DType = {
  src?: string
  globalCompositeOperation: GlobalCompositeOperation
}

class Effector {
  scene = new Scene()

  constructor() {
    this.scene.index = 2
  }

  onMounted(effectDom: HTMLDivElement) {
    const {
      scene: { canvas }
    } = this
    const { clientWidth: fx, clientHeight: fy } = effectDom
    effectDom.append(canvas)
    canvas.width = fx
    canvas.height = fy
  }

  onUnmounted() {
    this.scene.canvas.remove()
  }

  /* 添加图案 */
  addImgs(effectImg2DData: Img2DType[], resultCanvas: HTMLCanvasElement) {
    const {
      scene: {
        canvas: { width }
      },
      scene
    } = this
    const pros: Promise<HTMLImageElement>[] = []
    effectImg2DData.forEach(({ src, globalCompositeOperation }, index) => {
      let image: HTMLImageElement | HTMLCanvasElement = new Image()
      if (src) {
        console.log(src)
        image.src = src
        pros.push(ImagePromise(image))
      } else {
        image = resultCanvas
      }
      scene.add(
        new Img({
          size: new Vector2(width),
          offset: new Vector2(-width / 2),
          index,
          image,
          style: { globalCompositeOperation }
        })
      )
    })

    /* 渲染 */
    Promise.all(pros).then(() => {
      queueScene(this.scene)
    })
  }

  /* 渲染 */
  render() {
    queueScene(this.scene)
  }
}

export { Effector }
