import { Scene } from '../core'
import { Rectangle } from '../objects'
import { Matrix3 } from '../math'
import { Vector2 } from '../math'
import { Img, Object2D } from '../objects'

function crtPathByMatrix(
  ctx: CanvasRenderingContext2D,
  vertices: number[],
  matrix: Matrix3,
  closePath = false
) {
  const p0 = new Vector2(vertices[0], vertices[1]).applyMatrix3(matrix)
  ctx.moveTo(p0.x, p0.y)
  for (let i = 2, len = vertices.length; i < len; i += 2) {
    const pn = new Vector2(vertices[i], vertices[i + 1]).applyMatrix3(matrix)
    ctx.lineTo(pn.x, pn.y)
  }
  if (closePath) {
    ctx.closePath()
  }
}

function crtPath(
  ctx: CanvasRenderingContext2D,
  vertices: number[],
  closePath = false
) {
  const p0 = new Vector2(vertices[0], vertices[1])
  ctx.moveTo(p0.x, p0.y)
  for (let i = 2, len = vertices.length; i < len; i += 2) {
    const pn = new Vector2(vertices[i], vertices[i + 1])
    ctx.lineTo(pn.x, pn.y)
  }
  if (closePath) {
    ctx.closePath()
  }
}

function selectObj(
  group: Object2D[],
  mp: Vector2,
  scene: Scene
): Img | Rectangle | null {
  for (const item of [...group].reverse()) {
    if (
      (item instanceof Img || item instanceof Rectangle) &&
      scene.isPointInObj(item, mp, item.pvmoMatrix)
    ) {
      return item
    }
  }
  return null
}

export { crtPathByMatrix, crtPath, selectObj }
