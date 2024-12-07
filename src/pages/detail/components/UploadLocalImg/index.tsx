import React from 'react'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  },
  beforeUpload(file, fileList) {
    console.log(file, fileList)
    return false
  },
  showUploadList: false
}

const UploadLocalImg: React.FC = () => (
  <Dragger
    className="absolute right-0 w-[calc(100vw-180px)] h-full invisible"
    {...props}
  >
    <p className="ant-upload-drag-icon">
      <i className="fa-solid fa-inbox text-5xl"></i>
    </p>
    <p className="ant-upload-text">点击或拖拽到此处上传</p>
    <p className="ant-upload-hint">支持多文件上传，请勿上传敏感数据</p>
  </Dragger>
)

export default UploadLocalImg
