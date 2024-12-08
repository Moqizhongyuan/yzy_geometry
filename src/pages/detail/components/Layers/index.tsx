import { Editor } from '@canvas/core/Editor'
import style from './index.module.scss'
import cn from 'classnames'
import { Img } from '@canvas/objects'

export interface Layer {
  src: string
  name: string
  uuid: string
  active: boolean
  visible: boolean
}

const Layers = ({
  layers,
  setLayers,
  editor
}: {
  layers: Layer[]
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>
  editor: Editor
}) => {
  function selectLayer(index: number) {
    // 激活图层
    activateLayer(index)
    // 更新图案的控制状态
    editor.selectImgByUUID(layers[index].uuid)
  }

  function activateLayer(index: number) {
    setLayers(prev =>
      [...prev].map((l, i) => {
        l.active = i === index
        return l
      })
    )
  }

  function dragstart({ dataTransfer }: React.DragEvent, index: number) {
    if (dataTransfer) dataTransfer.setData('index', index.toString())
  }

  function drop({ dataTransfer }: React.DragEvent, index: number) {
    console.log('object')
    if (!dataTransfer) {
      return
    }

    /* 激活图层 */
    const dragIndex = parseInt(dataTransfer.getData('index'))
    activateLayer(dragIndex)

    /* 选择图案 */
    editor.selectImgByUUID(layers[dragIndex].uuid)
    /* 置换图层 */
    // ;[value[dragIndex], value[index]] = [value[index], value[dragIndex]]
    setLayers(prev => {
      const res = [...prev]
      ;[res[dragIndex], res[index]] = [res[index], res[dragIndex]]

      return res
    })
    /* 置换图案 */
    const len = layers.length - 1
    editor.replaceImg(len - dragIndex, len - index)
  }

  const {
    imgController,
    group,
    group: { children }
  } = editor
  imgController.addEventListener('selected', ({ obj }) => {
    // 更新图层选择状态
    activateLayer(children.length - 1 - children.indexOf(obj as Img))
  })

  group.addEventListener('remove', ({ obj }) => {
    // 删除图层
    removeLayer((obj as Img).uuid)
  })
  /* 删除图层 */
  function removeLayer(uuid: string) {
    setLayers(prev => [...prev].filter(item => item.uuid !== uuid))
  }

  return (
    <ul
      id="layer"
      className={`flex-1 p-1 space-y-1 overflow-auto ${style.layerList}`}
    >
      {layers.map((layer, index) => (
        <li
          className={cn(
            'flex p-2 gap-2 cursor-pointer rounded-md items-center',
            { [style.active]: layer.active },
            style.layerItem
          )}
          onClick={() => selectLayer(index)}
          key={layer.uuid}
          role="button"
          draggable="true"
          onDragOver={e => e.preventDefault()}
          onDragStart={e => dragstart(e, index)}
          onDrop={e => drop(e, index)}
        >
          <img className="w-6 h-6" src={layer.src} />
          <div className="flex-1">{layer.name}</div>
          <div
            className="hover:bg-gray-500 mr-1 w-6 h-6 text-center rounded transition-all duration-300"
            role="button"
            onClick={e => {
              e.stopPropagation()
              editor.setVisibleByUUID(layer.uuid)
              setLayers(prev => {
                const res = [...prev]
                res.map((l, i) => {
                  if (i === index) {
                    l.visible = !l.visible
                  }
                })
                return res
              })
            }}
          >
            {layer.visible ? (
              <i className="fa-solid fa-eye" />
            ) : (
              <i className="fa-solid fa-circle" />
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Layers
