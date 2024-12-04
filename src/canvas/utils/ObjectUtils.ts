import { Matrix3 } from '../math'
import { Vector2 } from '../math'

function crtPathByMatrix(
  ctx: CanvasRenderingContext2D,
  vertices: number[],
  matrix: Matrix3
) {
  const p0 = new Vector2(vertices[0], vertices[1]).applyMatrix3(matrix)
  ctx.moveTo(p0.x, p0.y)
  for (let i = 2, len = vertices.length; i < len; i += 2) {
    const pn = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(matrix)
    ctx.lineTo(pn.x, pn.y)
  }
  ctx.closePath()
}

export { crtPathByMatrix }
