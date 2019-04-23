import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';
import './Sourcemap.less';
import url from '../../api/index.js';
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  action: url.sourceMapUrl,
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

class Sourcemap extends Component {
  render() {
    return (
      <div className="sourcemap">
        <h3 className="sourcemap-header">上传SourceMap文件</h3>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽SourceMap文件到此区域进行上传</p>
          <span style={{fontSize: '12px'}}>由于目前线上代码是大部分是经过压缩处理后的，需要借助SoucrMap文件进行定位</span>
        </Dragger>
      </div>
    );
  }
}

export default Sourcemap;
