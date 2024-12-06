import { Menu, MenuProps } from 'antd'

export type MenuItem = Required<MenuProps>['items'][number]

const GeometryMenu = ({
  items,
  clickFn,
  selectKeys,
  className
}: {
  items: MenuItem[]
  clickFn: MenuProps['onClick']
  selectKeys?: string[]
  className?: string
}) => {
  return (
    <Menu
      style={{ width: 200 }}
      mode="inline"
      onClick={clickFn}
      items={items}
      selectedKeys={selectKeys}
      className={className}
    />
  )
}

export default GeometryMenu
