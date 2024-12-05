import { Menu, MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const GMenu = ({
  onClickFn,
  items,
  selectKeys
}: {
  onClickFn: MenuProps['onClick']
  items: MenuItem[]
  selectKeys?: string[]
}) => {
  return !selectKeys ? (
    <Menu
      onClick={onClickFn}
      style={{ width: 200 }}
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  ) : (
    <Menu
      selectedKeys={selectKeys}
      onSelect={onClickFn}
      onClick={onClickFn}
      style={{ width: 200 }}
      defaultSelectedKeys={['1']}
      mode="inline"
      items={items}
    />
  )
}

export { GMenu }
