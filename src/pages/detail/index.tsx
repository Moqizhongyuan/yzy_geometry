import { useRef, useState } from 'react'
import { GeometryMenu, MenuItem } from '@components/GeometryMenu'
import { Img, Rectangle } from '@canvas/objects'
import Canvas from './components/Canvas'
// import GeometryForm from './components/GeometryForm'

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

type Drawer = {
  geometry: Geometry
  rects: Rectangle[]
  imgs: Img[]
}

const Detail = () => {
  const [geometry, setGeometry] = useState<Geometry>(null)
  const drawer = useRef<Drawer>({
    geometry: null,
    rects: [],
    imgs: []
  })
  return (
    <div className="flex h-full relative">
      <GeometryMenu
        className="py-2"
        clickFn={e => {
          const geometry = e.key as Geometry
          setGeometry(geometry)
          drawer.current.geometry = geometry
        }}
        items={items}
        selectKeys={[geometry ?? '']}
      />
      <Canvas drawer={drawer} setGeometry={setGeometry} />
      {/* <GeometryForm /> */}
    </div>
  )
}

export default Detail
