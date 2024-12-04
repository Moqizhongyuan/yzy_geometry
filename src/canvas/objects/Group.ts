import { Object2D } from './Object2D'

class Group extends Object2D {
  children: Array<Object2D>
  constructor() {
    super()
    this.children = []
  }
  remove(obj?: Object2D) {
    if (obj) {
      const index = this.children.indexOf(obj)
      this.children.splice(index, 1)
    } else if (this.parent && !obj) {
      this.parent.remove(this)
    }
  }
}
export { Group }
