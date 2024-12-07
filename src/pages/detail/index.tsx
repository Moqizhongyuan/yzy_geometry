import { useEffect, useRef, useState } from 'react'
import GeometryMenu from './components/GeometryMenu'
import UploadLocalImg from './components/UploadLocalImg'
import { CursorType, Editor } from '@canvas/core/Editor'
import style from './index.module.scss'
import designImg from '@assets/design.png'

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
      extra: React.ReactNode
    }>
  >([])
  const menuItems = [
    ...[
      {
        key: 'rectangle',
        label: '矩形'
      },
      {
        key: 'image',
        label: '图像',
        children: [
          // {
          //   key: 'internetImg',
          //   label: '上传线上图像'
          // },
          {
            key: 'localImg',
            label: '上传本地图像'
          }
        ]
      }
      // {
      //   key: 'delete',
      //   label: '清空画布'
      // }
    ],
    ...localImgs
  ]
  useEffect(() => {
    const editor = new Editor(cursor)
    editor.onMounted(
      divRef.current as HTMLDivElement,
      divRightRef.current as HTMLDivElement
    )
    editor.editorScene.render()
    const img = new Image()
    img.src = designImg
    editor.setDesignImg(designImg)
    setEditor(editor)
  }, [])
  return (
    <div className="flex h-full relative">
      <GeometryMenu
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
        items={menuItems}
        selectKeys={['']}
      />
      <div
        className={`flex-[3] h-full cursor-${cursor} ${style.canvas}`}
        ref={divRef}
      ></div>
      <div ref={divRightRef} id="effect" className="flex-1"></div>
      <UploadLocalImg
        setLocalImgs={setLocalImgs}
        setVisible={setVisible}
        className={visible ? 'visible' : 'invisible'}
      />
    </div>
  )
}

export default Detail
