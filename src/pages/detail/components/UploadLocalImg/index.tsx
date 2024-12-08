import React, { ReactElement } from 'react'
import type { UploadProps } from 'antd'
import { Upload } from 'antd'

const { Dragger } = Upload

const UploadLocalImg = ({
  setLocalImgs,
  className,
  setVisible
}: {
  setLocalImgs: React.Dispatch<
    React.SetStateAction<
      Array<{
        key: string
        label: string
        extra: ReactElement
      }>
    >
  >
  className?: string
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  let flag = 0
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload(_, fileList) {
      if (!flag) {
        flag = 1
      } else {
        return false
      }
      const fileReaders = fileList.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      })
      Promise.all(fileReaders)
        .then(dataUrls => {
          setLocalImgs(prev => {
            return prev.concat(
              dataUrls.map((item, index) => ({
                key: `Img${prev.length + index} ${item}`,
                label: `Img${prev.length + index}`,
                extra: <img src={item} className="w-6 h-6" />
              }))
            )
          })
        })
        .catch(error => {
          console.error('Error reading files:', error)
        })
      setVisible(false)
      return false
    },
    showUploadList: false
  }

  return (
    <Dragger
      className={`absolute right-0 w-[calc(100vw-180px)] h-full ${className}`}
      {...props}
    >
      <p className="ant-upload-drag-icon">
        <i className="fa-solid fa-inbox text-5xl"></i>
      </p>
      <p className="ant-upload-text">点击或拖拽到此处上传</p>
      <p className="ant-upload-hint">支持多文件上传，请勿上传敏感数据</p>
    </Dragger>
  )
}

export default UploadLocalImg
