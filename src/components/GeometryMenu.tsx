import { MenuProps } from 'antd'
import { GMenu } from '../base/components'

export type MenuItem = Required<MenuProps>['items'][number]

const GeometryMenu = ({
  items,
  clickFn,
  selectKeys
}: {
  items: MenuItem[]
  clickFn: MenuProps['onClick']
  selectKeys?: string[]
}) => {
  return <GMenu onClickFn={clickFn} items={items} selectKeys={selectKeys} />
}

export { GeometryMenu }
