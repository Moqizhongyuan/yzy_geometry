import { Menu, MenuProps } from 'antd'
import MenuItem from 'antd/es/menu/MenuItem'

export type MenuItem = Required<MenuProps>['items'][number]

const GeometryMenu = ({
  localImgs,
  clickFn,
  selectKeys,
  className
}: {
  localImgs: {
    key: string
    label: string
    extra: React.ReactNode
  }[]
  clickFn: MenuProps['onClick']
  selectKeys?: string[]
  className?: string
}) => {
  const menuItems = [
    {
      key: 'rectangle',
      label: '矩形'
    },
    // {
    //   key: 'internetImg',
    //   label: '上传线上图像'
    // },
    {
      key: 'localImg',
      label: '上传本地图像'
    },
    {
      key: 'imgStorage',
      label: '图库',
      children: [...localImgs]
    }
  ]
  return (
    <Menu
      style={{ minWidth: 180, maxWidth: 180 }}
      mode="inline"
      onClick={clickFn}
      items={menuItems}
      selectedKeys={selectKeys}
      className={`${className} py-2`}
    />
  )
}

export default GeometryMenu
