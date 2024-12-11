import { MouseEvent, useEffect, useRef, useState } from 'react'
import style from './index.module.scss'

const ColorPicker = ({
  onColorPick,
  color
}: {
  onColorPick: React.Dispatch<React.SetStateAction<string>>
  color: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState('rgb(0, 0, 0)')
  const [isOpen, setIsOpen] = useState(false)

  const handleMouseMove = (
    event: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const pixel = ctx.getImageData(x, y, 1, 1).data
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
    setSelectedColor(color)
  }

  const handleClick = () => {
    if (onColorPick) {
      onColorPick(selectedColor)
    }
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Draw a gradient for demonstration
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0)
    gradient.addColorStop(0, 'red')
    gradient.addColorStop(0.5, 'green')
    gradient.addColorStop(1, 'blue')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      draw(ctx)
    }
  }, [])

  return (
    <div
      className={`absolute ease-in-out transition duration-200 ${isOpen ? '' : '-translate-x-64'} gap-2 items-center left-64 top-0 flex rounded-r-md p-2 ${style.colorPick}`}
    >
      <div>
        <canvas
          ref={canvasRef}
          width={248}
          height={50}
          onMouseMove={e => handleMouseMove(e)}
          onClick={handleClick}
          className="cursor-crosshair"
        ></canvas>
        <div>
          <p>
            当前颜色: <span>{selectedColor}</span>
          </p>
          <div className="flex items-center justify-between">
            <div>
              已选颜色:{' '}
              <input
                onChange={e => onColorPick(e.target.value)}
                value={color}
                type="text"
                className="w-[130px]"
              />
            </div>
            <div className="w-5 h-5" style={{ backgroundColor: color }} />
          </div>
        </div>
      </div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="hover:cursor-pointer text-xs"
      >
        {isOpen ? (
          <i className="fa-solid fa-arrow-left"></i>
        ) : (
          <i className="fa-solid fa-arrow-right"></i>
        )}
      </div>
    </div>
  )
}

export default ColorPicker
