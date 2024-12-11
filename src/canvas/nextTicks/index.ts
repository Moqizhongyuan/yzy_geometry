import { Scene } from '@canvas/core'

const callbacks: Array<() => void> = []
let pending = false

const has: { [key: string]: boolean | null | undefined } = {}
const queue: Scene[] = []
let waiting = false

function nextTick(cb: () => void) {
  callbacks.push(cb)

  if (!pending) {
    pending = true
    requestAnimationFrame(flushCallbacks)
  }
}

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

export function queueScene(obj: Scene) {
  const id: string = obj.uuid
  if (has[id] == null) {
    has[id] = true
    queue.push(obj)

    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

function flushSchedulerQueue() {
  queue.sort((a, b) => a.index - b.index)
  while (queue.length > 0) {
    const obj = queue.shift()!
    const id = obj.uuid
    has[id] = null
    obj.render()
  }
  waiting = false
}
