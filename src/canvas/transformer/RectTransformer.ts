// import { Rectangle } from '../objects'
import { Vector2 } from '../math'
import { Object2DTransformer } from './Object2DTransformer'
export type RectData = {
  position: Vector2
  scale: Vector2
  rotate: number
  offset: Vector2
}
// type RectTransformerType = {
//   rect?: Rectangle
//   origin?: Vector2
//   mousePos?: Vector2
//   mouseStart?: Vector2
//   uniformRotateAng?: number
// }
class RectTransformer extends Object2DTransformer {}
export { RectTransformer }
