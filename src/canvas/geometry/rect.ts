import { Vector2 } from '../math'
import { Object2D } from '../objects'

class Rectangle extends Object2D {
  private width: number
  private height: number
  constructor(x: number, y: number, width: number = 20, height: number = 20) {
    super()
    this.width = width
    this.height = height
    this.position = new Vector2(x, y)
  }
  drawShape(ctx: CanvasRenderingContext2D) {
    const {
      position: { x, y },
      width,
      height
    } = this
    ctx.save()
    ctx.strokeStyle = 'black'
    ctx.strokeRect(x, y, width, height)
    ctx.restore()
  }
}

export { Rectangle }
