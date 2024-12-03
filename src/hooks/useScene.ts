import { Scene } from '../canvas/core'

export function useScene(canvas?: HTMLCanvasElement) {
  const scene = new Scene()
  if (canvas) {
    scene.canvas = canvas
  }
  return scene
}
