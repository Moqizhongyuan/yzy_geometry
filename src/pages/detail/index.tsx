import { ReactElement, useEffect, useRef, useState } from 'react'
import GeometryMenu from './components/GeometryMenu'
import UploadLocalImg from './components/UploadLocalImg'
import { CursorType, Editor } from '@canvas/core/Editor'
import style from './index.module.scss'
import { Effector } from '@canvas/core/Effector'
import Layers from './components/Layers'

const Detail = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const divRightRef = useRef<HTMLDivElement>(null)
  const cursor = useState<CursorType>('default')
  const [visible, setVisible] = useState(false)
  const [editor, setEditor] = useState<Editor>()
  const [localImgs, setLocalImgs] = useState<
    Array<{
      key: string
      label: string
      extra: ReactElement
    }>
  >([])
  useEffect(() => {
    const editor = new Editor(cursor)
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
    editor.onMounted(
      divRef.current as HTMLDivElement,
      divRightRef.current as HTMLDivElement
    )
    editor.editorScene.render()
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
  }, [])
  return (
    <div className="flex h-full relative">
      <GeometryMenu
        localImgs={localImgs}
        clickFn={e => {
          const geometry = e.key
          const img = new Image()
          switch (geometry) {
            case 'rectangle':
              editor?.addGeometry('rect')
              break
            case 'localImg':
              setVisible(!visible)
              break
            default:
              img.src = e.key.split(' ')[1]
              img.onload = () => {
                editor?.addGeometry(img)
              }
          }
        }}
        selectKeys={['']}
      />
      <div
        className={`flex-1 h-full cursor-${cursor} ${style.canvas}`}
        ref={divRef}
      ></div>
      <div id="right" className="h-full flex flex-col">
        <div
          ref={divRightRef}
          id="effect"
          className={`${style.canvas} h-[300px] w-[300px]`}
        ></div>
        <Layers />
      </div>
      <UploadLocalImg
        setLocalImgs={setLocalImgs}
        setVisible={setVisible}
        className={visible ? 'visible' : 'invisible'}
      />
    </div>
  )
}

export default Detail
