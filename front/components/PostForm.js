import { PlusOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import { Button, Form, Input, InputNumber, Select, Upload, Modal } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { submitReport, submitImage } from "../reducers/post";
import useInput from "../hooks/useInput";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const normFile = (e, any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};
const PostForm = () => {
  const dispatch = useDispatch();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imagePath, setImeagePath] = useState([]);
  const [name, onChangeName] = useInput("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const { imagePaths } = useSelector((state) => state.post);

  const onSumbitForm = useCallback(() => {
    const formData = new FormData();
    console.log("images", fileList.originFileObj);
    console.log(imagePath);
    fileList.forEach((e) => {
      console.log(e.originFileObj);
      formData.append("image", e.originFileObj);
    });

    // formData.append("name", name);
    // formData.append("sex", sex);
    // formData.append("age", age);
    // console.log(formData);

    dispatch(submitImage(formData));
    // dispatch(submitReport(formData));
  }, [age, dispatch, fileList, name, sex]);

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const onChangeSex = (value) => {
    setSex(value);
  };
  const onChangeAge = (value) => {
    setAge(value);
  };

  const handleChange = (e) => {
    const imageFormData = new FormData();
    console.log("images", e.fileList);

    e.fileList.forEach((f) => {
      imageFormData.append("image", f.originFileObj);
      imagePath.push(f.originFileObj);
      console.log(imagePath);
    });
    for (let key of imageFormData.keys()) {
      console.log(key);
    }
    for (let value of imageFormData.values()) {
      console.log(value);
    }

    setFileList(e.fileList);

    // dispatch(submitImage(imageFormData));
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        encType="multipart/form-data"
        style={{
          maxWidth: 600,
          margin: 30,
          marginTop: 100,
        }}
        onFinish={onSumbitForm}
      >
        <Form.Item label="이름">
          <Input name="name" value={name} required onChange={onChangeName} />
        </Form.Item>
        <Form.Item label="성별">
          <Select onChange={onChangeSex}>
            <Select.Option value="남자">남자</Select.Option>
            <Select.Option value="여자">여자</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="나이">
          <InputNumber
            name="age"
            defaultvalue="1"
            required
            onChange={onChangeAge}
          />
        </Form.Item>

        <Form.Item
          label="사진"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Form.Item>

        <Form.Item style={{ marginLeft: 50 }}>
          <Button type="primary" htmlType="submit">
            제출
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => <PostForm />;
