import { useEffect, useState } from 'react'
import { Scene } from '../canvas/core'

export function useScene(canvas?: HTMLCanvasElement) {
  const [scene, SetScene] = useState<Scene>()
  useEffect(() => {
    const scene = new Scene('grid')
    if (canvas) {
      scene.canvas = canvas
    }
    SetScene(scene)
  }, [canvas])
  return scene
}
