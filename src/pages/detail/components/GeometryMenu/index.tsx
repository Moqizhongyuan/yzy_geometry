import { Menu, MenuProps } from 'antd'
import MenuItem from 'antd/es/menu/MenuItem'
import { ReactElement } from 'react'

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
    extra: ReactElement
  }[]
  clickFn: MenuProps['onClick']
  selectKeys?: string[]
  className?: string
}) => {
  const menuItems = [
    // {
    //   key: 'rectangle',
    //   label: '矩形'
    // },
    {
      key: 'text',
      label: '文字',
      children: [
        {
          key: 'aaa',
          label: 'aaa'
        }
      ]
    },
    {
      key: 'imgStorage',
      label: '图像',
      children: [
        {
          key: 'localImg',
          label: '上传本地图像'
        },
        ...[...Array(8)]
          .map((_, index) => ({
            key: `img${index} /images/${index + 1}.png`,
            label: `img${index}`,
            extra: <img src={`/images/${index + 1}.png`} className="w-6 h-6" />
          }))
          .concat(...localImgs)
      ]
    }
  ]
  return (
    <Menu
      style={{ minWidth: 180, maxWidth: 180 }}
      mode="inline"
      onClick={clickFn}
      items={menuItems}
      selectedKeys={selectKeys}
      className={`${className} py-2 overflow-auto`}
    />
  )
}

export default GeometryMenu
