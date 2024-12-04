import { useEffect, useState } from 'react'
import { Camera } from '../canvas/core'
import { OrbitController } from '../canvas/controller'

export function useOrbitController(camera?: Camera) {
  const [orbitController, setOrbitController] = useState<OrbitController>()
  useEffect(() => {
    if (camera) {
      const orbitController = new OrbitController(camera)
      setOrbitController(orbitController)
    }
  }, [camera])
  return orbitController
}
