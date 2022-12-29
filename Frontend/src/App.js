import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // return (
  //   <div className="main">
  //     <div>
  //       <h1>Upload single image on local server </h1>
  //       <input type="file" multiple max="5" />
  //     </div>
  //   </div>
  // );

  const [fileSingleLocal, setfileSingleLocal] = useState([]);
  const [fileMultipleLocal, setfileMultipleLocal] = useState([]);
  const [fileSingleS3, setfileSingleS3] = useState([]);
  const [fileMultipleS3, setfileMultipleS3] = useState([]);
  const url = 'http://localhost:4000/';
  const handleChangeSingleLocal = ({ fileList: newFileList }) =>
    setfileSingleLocal(newFileList);
  const handleChangeMultipleLocal = ({ fileList: newFileList }) =>
    setfileMultipleLocal(newFileList);
  const handleChangeSingleS3 = ({ fileList: newFileList }) =>
    setfileSingleS3(newFileList);
  const handleChangeMultipleS3 = ({ fileList: newFileList }) =>
    setfileMultipleS3(newFileList);

  const handleSubmit = async (e) => {
    try {
      const name = e.target.id;
      const data = new FormData();

      if (name === 'singleLocal') {
        data.append('profile', fileSingleLocal[0].originFileObj);
        const response = await axios.post(`${url}uploadSingle`, data);
        if (response) {
          alert(response.data.profile_url);
          setfileSingleLocal([]);
        }
      }
      if (name === 'multipleLocal') {
        fileMultipleLocal.forEach((file) =>
          data.append('profile', file.originFileObj)
        );

        const response = await axios.post(`${url}uploadMultiple`, data);
        if (response) {
          alert(response.data.profile_urls.map((data) => `${data}\n`));
          setfileMultipleLocal([]);
        }
      }
      if (name === 'singleS3') {
        data.append('profile', fileSingleS3[0].originFileObj);
        const response = await axios.post(`${url}uploadS3Single`, data);
        if (response) {
          alert(response.data.profile_url);
          setfileSingleS3([]);
        }
      }
      if (name === 'multipleS3') {
        fileMultipleS3.forEach((file) =>
          data.append('profile', file.originFileObj)
        );

        const response = await axios.post(`${url}uploadS3Multiple`, data);
        if (response) {
          alert(response.data.profile_urls.map((data) => `${data}\n`));
          setfileMultipleS3([]);
        }
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div className="Superior">
      <div className="Second-Superior">
        <h1>Upload Single Image on Local Server</h1>
        <>
          <Upload
            listType="picture-card"
            fileList={fileSingleLocal}
            onChange={handleChangeSingleLocal}
            maxCount={1}
            showUploadList={{ showPreviewIcon: false }}
            beforeUpload={(file) => {
              const isImage = file.type.includes('image/');
              if (!isImage) {
                alert('Invalid Image Type');
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            {fileSingleLocal.length < 1 && '+ Upload'}
          </Upload>
        </>
        <button
          size={'large'}
          id="singleLocal"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <UploadOutlined /> Upload
        </button>
      </div>
      <div className="Second-Superior">
        <h1>Upload Multiple - 5 Image on Local Server</h1>
        <>
          <Upload
            listType="picture-card"
            fileList={fileMultipleLocal}
            onChange={handleChangeMultipleLocal}
            maxCount={5}
            showUploadList={{ showPreviewIcon: false }}
            beforeUpload={(file) => {
              const isImage = file.type.includes('image/');
              if (!isImage) {
                alert('Invalid Image Type');
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            {fileMultipleLocal.length < 5 && '+ Upload'}
          </Upload>
        </>
        <button
          size={'large'}
          id="multipleLocal"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <UploadOutlined /> Upload
        </button>
      </div>
      <div className="Second-Superior">
        <h1>Upload Single Image on S3 Server</h1>
        <>
          <Upload
            listType="picture-card"
            fileList={fileSingleS3}
            onChange={handleChangeSingleS3}
            maxCount={1}
            showUploadList={{ showPreviewIcon: false }}
            beforeUpload={(file) => {
              const isImage = file.type.includes('image/');
              if (!isImage) {
                alert('Invalid Image Type');
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            {fileSingleS3.length < 1 && '+ Upload'}
          </Upload>
        </>
        <button
          size={'large'}
          id="singleS3" 
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <UploadOutlined /> Upload
        </button>
      </div>
      <div className="Second-Superior">
        <h1>Upload Multiple - 5 Image on S3 Server</h1>
        <>
          <Upload
            listType="picture-card"
            fileList={fileMultipleS3}
            onChange={handleChangeMultipleS3}
            maxCount={5}
            showUploadList={{ showPreviewIcon: false }}
            beforeUpload={(file) => {
              const isImage = file.type.includes('image/');
              if (!isImage) {
                alert('Invalid Image Type');
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            {fileMultipleS3.length < 5 && '+ Upload'}
          </Upload>
        </>
        <button
          size={'large'}
          id="multipleS3"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          <UploadOutlined /> Upload
        </button>
      </div>
    </div>
  );
}

export default App;
