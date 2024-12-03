import { useEffect } from 'react'

export function useCanvasGrid(
  canvas: HTMLCanvasElement | undefined,
  gridSize?: number,
  gridColor?: string
) {
  useEffect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d')!
      const height = canvas.height
      const width = canvas.width
      const size = gridSize ?? 20
      const color = gridColor ?? '#ddd'
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      for (let y = 0; y <= height; y += size) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // 绘制垂直网格线
      for (let x = 0; x <= width; x += size) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
    }
  }, [canvas, gridColor, gridSize])
}
