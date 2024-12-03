import { describe, expect, it, vi } from 'vitest'
import { CustomEvent, EventDispatcher } from '../canvas/core'
describe('EventDispatcher', () => {
  it('事件触发功能测试', () => {
    const logSpy = vi.spyOn(console, 'log')
    const eventDispatcher = new EventDispatcher()
    const fn1 = function (event: CustomEvent) {
      console.log('------------')
      console.log(1)
      console.log(event)
      console.log('------------')
    }
    const fn2 = function (event: CustomEvent) {
      console.log('------------')
      console.log(2)
      console.log(event)
      console.log('------------')
    }
    eventDispatcher.addEventListener('typeA', fn1)
    eventDispatcher.addEventListener('typeA', fn2)
    console.log(eventDispatcher.hasEventListener('typeA', fn1))
    eventDispatcher.dispatchEvent({ type: 'typeA' })
    eventDispatcher.removeEventListener('typeA', fn1)
    console.log(eventDispatcher.hasEventListener('typeA', fn1))
    const logOutput = logSpy.mock.calls.map(call => call[0]).join('\n')
    console.log(logOutput)
    expect(logOutput).toBe(`true
------------
1
[object Object]
------------
------------
2
[object Object]
------------
false`)
    logSpy.mockRestore()
  })

  it('继承测试', () => {
    const logSpy = vi.spyOn(console, 'log')
    class Wolf extends EventDispatcher {
      constructor(public name: string) {
        super()
      }
    }
    const wolf = new Wolf('灰太狼')
    wolf.addEventListener('coming', event => {
      console.log((event.target as Wolf).name + '来啦！')
    })
    wolf.dispatchEvent({ type: 'coming' })
    const logOutput = logSpy.mock.calls.map(call => call[0]).join('\n')
    expect(logOutput).toBe('灰太狼来啦！')
  })
})
