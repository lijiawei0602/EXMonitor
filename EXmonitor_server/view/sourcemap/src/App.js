import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import './App.css';
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  action: '/api/sourceMap',
  onChange (info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file upload successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed`);
    }
  },
};

class App extends Component {
  render() {
    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽SourceMap文件到此区域进行上传</p>
        </Dragger>
      </div>
    );
  }
}

export default App;
