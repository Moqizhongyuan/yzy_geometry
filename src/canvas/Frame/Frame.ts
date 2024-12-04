import { Matrix3 } from '../math'
import { Vector2 } from '../math'

/* 鼠标状态 */
export type State = 'scale' | 'scaleX' | 'scaleY' | 'rotate' | 'move' | null

type Level = 'moMatrix' | 'pvmoMatrix'

export interface IFrame {
  level?: Level
}

abstract class Frame {
  vertices: number[] = []
  // 图案中点
  center = new Vector2()
  // 路径变换矩阵
  matrix = new Matrix3()
  // 要把路径变换到哪个坐标系中，默认裁剪坐标系
  level = 'pvmoMatrix'

  // 描边色
  strokeStyle = '#558ef0'
  // 填充色
  fillStyle = '#fff'
  // 对面节点
  opposite = new Vector2()

  /* 更新矩阵、路径初始顶点、中点 */
  abstract updateShape(): void

  abstract draw(ctx: CanvasRenderingContext2D): void

  abstract getMouseState(mp: Vector2): State
}
export { Frame }
