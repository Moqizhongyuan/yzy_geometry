import { useEffect, useState } from 'react'

export function useCanvas(parent: HTMLElement | null) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  useEffect(() => {
    const canvasEl = document.createElement('canvas')
    if (parent) {
      canvasEl.width = parent.offsetWidth
      canvasEl.height = parent.offsetHeight
      parent.appendChild(canvasEl)
    }
    setCanvas(canvasEl)
  }, [parent])
  return { canvas, width: canvas?.width, height: canvas?.height }
}
