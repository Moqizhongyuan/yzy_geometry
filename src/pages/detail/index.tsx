import { useEffect, useRef, useState } from 'react'
import GeometryMenu, { MenuItem } from './components/GeometryMenu'
import UploadLocalImg from './components/UploadLocalImg'
import { CursorType, Editor } from '@canvas/core/Editor'
import style from './index.module.scss'

const items: MenuItem[] = [
  {
    key: 'rectangle',
    label: '矩形'
  },
  {
    key: 'image',
    label: '图像',
    children: [
      {
        key: 'internetImg',
        label: '线上图像'
      },
      {
        key: 'localImg',
        label: '本地图像'
      }
    ]
  },
  {
    key: 'cancel',
    label: '取消'
  }
]

type Geometry = 'rectangle' | 'image' | null

const Detail = () => {
  const divRef = useRef<HTMLDivElement>(null)
  const cursor = useState<CursorType>('default')
  const [editor, setEditor] = useState<Editor>()
  useEffect(() => {
    const editor = new Editor(cursor)
    editor.onMounted(divRef.current as HTMLDivElement)
    editor.editorScene.render()
    setEditor(editor)
  }, [])
  return (
    <div className="flex h-full relative">
      <GeometryMenu
        clickFn={e => {
          const geometry = e.key as Geometry
          switch (geometry) {
            case 'rectangle':
              editor?.addGeometry('rect')
          }
        }}
        items={items}
        selectKeys={['']}
      />
      <div
        className={`w-full h-full cursor-${cursor} ${style.canvas}`}
        ref={divRef}
      ></div>
      <UploadLocalImg />
    </div>
  )
}

export default Detail
