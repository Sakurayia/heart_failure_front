import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, InputNumber } from 'antd';
import { AlignCenterOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { TextArea } = Input;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = props => {
  const [formVals, setFormVals] = useState({
    cgid: props.values.cgid,
    name: props.values.name,
    label: props.values.label,
    description: props.values.description,
    key: props.values.key,
  });
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const handleNext = async () => {
    //const fieldsValue = await form.validateFields();
    form.validateFields().then(values => {
      handleUpdate({...values, cgid: formVals.cgid});
    })
  };

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入医生的姓名！',
            },
          ]}
        >
          <Input placeholder="请输入医生的姓名" />
        </FormItem>
        <FormItem
          name="label"
          label="标签"
        >
          <Input placeholder="请输入医生的标签" />
        </FormItem>
        <FormItem
          name="description"
          label="描述"
        >
          <TextArea rows={3} placeholder="请输入医生的描述" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="修改医生信息"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          label: formVals.label,
          description: formVals.description,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
