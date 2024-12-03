import { Menu, MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const GMenu = ({
  onClickFn,
  items
}: {
  onClickFn: MenuProps['onClick']
  items: MenuItem[]
}) => {
  return (
    <Menu
      onClick={onClickFn}
      style={{ width: 200 }}
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  )
}

export default GMenu
