import { ReactElement, useEffect, useRef, useState } from 'react'
import GeometryMenu from './components/GeometryMenu'
import UploadLocalImg from './components/UploadLocalImg'
import { CursorType, Editor } from '@canvas/core/Editor'
import style from './index.module.scss'
import { Effector } from '@canvas/core/Effector'
import Layers, { Layer } from './components/Layers'
import { Img, Rectangle, Text, Circle } from '@canvas/objects'
import { Vector2 } from '@canvas/math'
import DrawStyle from './components/DrawStyle'

const effectImgData: Array<{
  src: string
  globalCompositeOperation: GlobalCompositeOperation
}> = [
  {
    src: '',
    globalCompositeOperation: 'source-over'
  },
  {
    src: '/images/shirt-shadow.jpg.webp',
    globalCompositeOperation: 'multiply'
  },
  {
    src: '/images/shirt-mask.jpg.webp',
    globalCompositeOperation: 'destination-in'
  },
  {
    src: '',
    globalCompositeOperation: 'destination-in'
  },
  {
    src: '/images/shirt-origin.jpg.webp',
    globalCompositeOperation: 'destination-over'
  }
]

function isWebPSupported(callback: (val: boolean) => void) {
  const img = new Image()
  img.onload = () => {
    callback(true)
  }
  img.onerror = () => {
    callback(false)
  }

  // 测试用的 WebP 数据 URI（包含一个 1x1 的透明像素）
  img.src = '/images/shirt-shadow.jpg.webp'
}

isWebPSupported(supported => {
  if (!supported) {
    effectImgData.map(item => {
      if (item.src) {
        const arr = item.src.split('.')
        arr.pop()
        item.src = arr.join('.')
      }
      return item
    })
  }
})

const Detail = () => {
  const [strokeColor, setStrokeColor] = useState<string>('rgb(0, 0, 0)')
  const [fillColor, setFillColor] = useState<string>('rgb(0, 0, 0)')
  const divRef = useRef<HTMLDivElement>(null)
  const divRightRef = useRef<HTMLDivElement>(null)
  const cursor = useRef<CursorType>('default')
  const [layers, setLayers] = useState<Layer[]>([])
  const [visible, setVisible] = useState(false)
  const [editor, setEditor] = useState<Editor>(new Editor(cursor))
  const [localImgs, setLocalImgs] = useState<
    Array<{
      key: string
      label: string
      extra: ReactElement
    }>
  >([])
  const [text, setText] = useState<string>('')
  const [strokeWidth, setStrokeWidth] = useState(0)
  useEffect(() => {
    editor.onMounted(
      divRef.current as HTMLDivElement,
      divRightRef.current as HTMLDivElement
    )
    editor.setDesignImg('/images/design.jpg.webp')
    setEditor(editor)
    const effector = new Effector()
    effector.addImgs(effectImgData, editor.resultScene.canvas)
    effector.onMounted(divRightRef.current as HTMLDivElement)
    editor.addEventListener('render', () => {
      effector.render()
    })
    return () => {
      editor.onUnmounted()
      effector.onUnmounted()
    }
  }, [editor])
  useEffect(() => {
    const obj = editor.controller.obj
    if (obj) {
      obj.setOption({
        style: {
          lineWidth: strokeWidth,
          strokeStyle: strokeColor,
          fillStyle: fillColor
        }
      })
      editor.controller.dispatchEvent({ type: 'transformed', obj })
    }
  }, [strokeWidth, strokeColor, fillColor, editor])
  return (
    <div className="flex h-full relative">
      <GeometryMenu
        text={text}
        setText={setText}
        localImgs={localImgs}
        clickFn={e => {
          const geometry = e.key
          let obj: Img | Text | Rectangle
          const lineWidth = strokeWidth / 10
          const img = new Image()
          const text2D = new Text({
            text,
            style: {
              fillStyle: fillColor,
              strokeStyle: strokeColor,
              lineWidth
            }
          })
          const rect2D = new Rectangle({
            size: new Vector2(200, 200),
            style: {
              strokeStyle: strokeColor,
              lineWidth,
              fillStyle: fillColor
            }
          })
          const circle2D = new Circle({
            size: new Vector2(200, 200),
            style: {
              strokeStyle: strokeColor,
              lineWidth,
              fillStyle: fillColor
            }
          })
          switch (geometry) {
            case 'circle':
              obj = editor?.addGeometry(circle2D) as Circle
              setLayers(prev => {
                const res = [...prev].map(item => {
                  item.active = false
                  return item
                })
                res.unshift({
                  active: true,
                  uuid: obj.uuid,
                  name: obj.name,
                  visible: obj.visible
                })
                return res
              })
              break
            case 'rectangle':
              obj = editor?.addGeometry(rect2D) as Rectangle
              setLayers(prev => {
                const res = [...prev].map(item => {
                  item.active = false
                  return item
                })
                res.unshift({
                  active: true,
                  uuid: obj.uuid,
                  name: obj.name,
                  visible: obj.visible
                })
                return res
              })
              break
            case 'text':
              obj = editor?.addGeometry(text2D) as Text
              setLayers(prev => {
                const res = [...prev].map(item => {
                  item.active = false
                  return item
                })
                res.unshift({
                  active: true,
                  uuid: obj.uuid,
                  name: obj.name,
                  visible: obj.visible
                })
                return res
              })
              break
            case 'localImg':
              setVisible(!visible)
              break
            default:
              setVisible(false)
              img.src = e.key.split(' ')[1]
              img.onload = () => {
                const { uuid, name, visible } = editor?.addGeometry(img) ?? {
                  uuid: '',
                  name: '',
                  visible: true
                }
                setLayers(prev => {
                  const res = [...prev].map(item => {
                    item.active = false
                    return item
                  })
                  res.unshift({
                    src: img.src,
                    active: true,
                    uuid,
                    name,
                    visible
                  })
                  return res
                })
              }
          }
        }}
        selectKeys={['']}
      />
      <div
        className={`flex-1 h-full cursor-${cursor.current} ${style.canvas}`}
        ref={divRef}
      ></div>
      <div id="right" className="h-full flex flex-col">
        <div
          ref={divRightRef}
          id="effect"
          className={`${style.canvas} h-[300px] w-[300px]`}
        ></div>
        <Layers editor={editor} layers={layers} setLayers={setLayers} />
      </div>
      <UploadLocalImg
        setLocalImgs={setLocalImgs}
        setVisible={setVisible}
        className={visible ? 'visible' : 'invisible'}
      />
      <DrawStyle
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        fillColor={fillColor}
        strokeColor={strokeColor}
        setFillColor={setFillColor}
        setStrokeColor={setStrokeColor}
      />
    </div>
  )
}

export default Detail
