export interface Layer {
  src: string
  name: string
  uuid: string
  active: boolean
}

const Layers = ({ layers }: { layers: Layer[] }) => {
  console.log(layers)
  return (
    <div id="layer" className="flex-1">
      {/* {layers.map((item, index) => (
        <div key={item.uuid}>{index}</div>
      ))} */}
    </div>
  )
}

export default Layers
