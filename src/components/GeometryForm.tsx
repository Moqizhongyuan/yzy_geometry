import { Form } from 'antd'

const GeometryForm = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} absolute bg-black/50 w-full h-full flex justify-center items-center`}
    >
      <Form className="bg-white w-1/3 h-1/3 p-10 rounded-lg" />
    </div>
  )
}

export default GeometryForm
