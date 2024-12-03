import { Scene } from '../core'
import { Object2D } from './Object2D'

export type ThemeType = 'coordinate' | 'grid' | 'none'

const DISTANCE = 10000

class Background extends Object2D {
  private theme: ThemeType
  constructor(theme: ThemeType) {
    super()
    this.theme = theme
  }

  drawShape(ctx: CanvasRenderingContext2D): void {
    const {
      canvas: { height, width }
    } = this.parent as Scene
    switch (this.theme) {
      case 'grid':
        ctx.strokeStyle = '#ddd'
        for (let y = -DISTANCE; y <= DISTANCE; y += 20) {
          ctx.beginPath()
          ctx.moveTo(-DISTANCE, y)
          ctx.lineTo(DISTANCE, y)
          ctx.stroke()
        }

        // 绘制垂直网格线
        for (let x = -DISTANCE; x <= DISTANCE; x += 20) {
          ctx.beginPath()
          ctx.moveTo(x, -DISTANCE)
          ctx.lineTo(x, DISTANCE)
          ctx.stroke()
        }
        break
      case 'coordinate':
        ctx.strokeStyle = '#666'
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.moveTo(-width / 2, 0)
        ctx.lineTo(width / 2, 0)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(width / 2, 0)
        ctx.lineTo(width / 2 - 17, 10)
        ctx.lineTo(width / 2 - 17, -10)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(0, -height / 2)
        ctx.lineTo(0, height / 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(10, height / 2 - 17)
        ctx.lineTo(-10, height / 2 - 17)
        ctx.closePath()
        ctx.fill()
        break
      case 'none':
        break
    }
  }
}
export { Background }
