import { MouseEvent, useEffect, useRef, useState } from 'react'
import style from './index.module.scss'

const DrawStyle = ({
  setFillColor,
  fillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth
}: {
  setFillColor: React.Dispatch<React.SetStateAction<string>>
  fillColor: string
  strokeColor: string
  setStrokeColor: React.Dispatch<React.SetStateAction<string>>
  strokeWidth: number
  setStrokeWidth: React.Dispatch<React.SetStateAction<number>>
}) => {
  const min = 0,
    max = 100
  const fillColorCanvasRef = useRef<HTMLCanvasElement>(null)
  const strokeColorCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isOpen, setIsOpen] = useState(true)

  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = (
    e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>,
    isFillColor: boolean
  ) => {
    const canvas = isFillColor
      ? fillColorCanvasRef.current
      : strokeColorCanvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pixel = ctx?.getImageData(x, 0, 1, 1).data
    const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
    if (isFillColor) {
      setFillColor(color)
    } else {
      setStrokeColor(color)
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
    const canvas = fillColorCanvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      draw(ctx)
    }
    const strokeColorCanvas = strokeColorCanvasRef.current
    const strokeColorCtx = strokeColorCanvas?.getContext('2d', {
      willReadFrequently: true
    })
    if (strokeColorCtx) {
      draw(strokeColorCtx)
    }
    setStrokeWidth(0)
  }, [setStrokeWidth])

  const handleDragStart = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDrag = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (!isDragging || !sliderRef.current) return

    const slider = sliderRef.current
    const rect = slider.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const newValue = Math.round((offsetX / rect.width) * (max - min) + min)
    updateValue(Math.max(min, Math.min(max, newValue)))
  }

  const handleDragEnd = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (isDragging) {
      handleDrag(e)
      setIsDragging(false)
    } else {
      return
    }
  }

  const updateValue = (newValue: number) => {
    setStrokeWidth(newValue)
  }

  return (
    <div
      className={`absolute ease-in-out transition duration-200 ${isOpen ? '' : '-translate-x-64'} gap-2 items-center left-64 top-0 flex rounded-r-md p-2 ${style.colorPick}`}
    >
      <div>
        <canvas
          ref={strokeColorCanvasRef}
          width={248}
          height={25}
          onClick={e => handleClick(e, false)}
          className="cursor-crosshair"
        ></canvas>
        <div className="flex items-center justify-between">
          <div>
            描边颜色:{' '}
            <input
              onChange={e => setStrokeColor(e.target.value)}
              value={strokeColor}
              type="text"
              className="w-[130px]"
            />
          </div>
          <div className="w-5 h-5" style={{ backgroundColor: strokeColor }} />
        </div>
        <canvas
          ref={fillColorCanvasRef}
          width={248}
          height={25}
          onClick={e => handleClick(e, true)}
          className="cursor-crosshair"
        ></canvas>
        <div className="flex items-center justify-between">
          <div>
            填充颜色:{' '}
            <input
              onChange={e => setFillColor(e.target.value)}
              value={fillColor}
              type="text"
              className="w-[130px]"
            />
          </div>
          <div className="w-5 h-5" style={{ backgroundColor: fillColor }} />
        </div>
        <div>
          <div
            className="relative h-6"
            ref={sliderRef}
            onPointerDown={e => handleDragStart(e)}
            onPointerMove={e => handleDrag(e)}
            onPointerUp={e => handleDragEnd(e)}
            onPointerLeave={e => handleDragEnd(e)}
          >
            <div className="bg-gray-500 h-1 absolute w-full top-[10px]" />
            <i
              role="button"
              className="fa-solid fa-bolt absolute text-base top-0 -translate-x-[6px]"
              style={{ left: `${((strokeWidth - min) / (max - min)) * 100}%` }}
            />
          </div>
          <input
            type="number"
            value={strokeWidth || ''}
            onChange={e =>
              setStrokeWidth(
                Math.max(min, Math.min(Number(e.target.value), max))
              )
            }
          />
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

export default DrawStyle
