import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, AutoComplete, InputNumber } from 'antd';

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

const CreateForm = props => {
  const [formVals, setFormVals] = useState({});
  const [form] = Form.useForm();
  const {
    onSubmit: handleAdd,
    onCancel: handleModalVisible,
    modalVisible,
  } = props;

  const handleNext = async () => {
    //const fieldsValue = await form.validateFields();
    form.validateFields().then(values => {
      handleAdd(values);
    })
  };

  const InitForm = () => {
    form.resetFields();
  }

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
        <Button onClick={() => handleModalVisible(false)}>取消</Button>
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
      destroyOnClose={true}
      title="新增医生"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      afterClose={() => InitForm()}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
