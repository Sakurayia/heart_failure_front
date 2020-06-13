import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, AutoComplete, InputNumber } from 'antd';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
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
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const {
    onSubmit: handleAdd,
    onCancel: handleModalVisible,
    modalVisible,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    //const fieldsValue = await form.validateFields();
    form.validateFields().then(values => {
      let newFormVals = Object.assign({}, formVals, values);
      newFormVals.age = parseInt(newFormVals.age);
      setFormVals({ ...newFormVals });

      if (currentStep < 1) {
        forward();
      } else {
        handleAdd(newFormVals);
      }  
    })
  };

  const InitForm = () => {
    form.resetFields();
    setCurrentStep(0);
  }

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <FormItem name="language" label="语言">
            <Input placeholder="请输入病人的语言" />
          </FormItem>
          <FormItem name="religion" label="宗教信仰">
            <Input placeholder="请输入病人的宗教信仰" />
          </FormItem>
          <FormItem name="marital_status" label="婚姻状况">
            <Select
              style={{
                width: '100%',
              }}
            >
              <Option value="MARRIED">MARRIED</Option>
              <Option value="SEPARATED">SEPARATED</Option>
              <Option value="WIDOWED">WIDOWED</Option>
              <Option value="SINGLE">SINGLE</Option>
              <Option value="DIVORCED">DIVORCED</Option>
              <Option value="LIFE PARTNER">LIFE PARTNER</Option>
              <Option value="UNKNOWN">UNKNOWN</Option>
            </Select>
          </FormItem>
          <FormItem name="ethnicity" label="种族">
            <Input placeholder="请输入病人的种族" />
          </FormItem>
        </>
      );
    }

    return (
      <>
        <FormItem
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: '请输入病人的姓名！',
            },
          ]}
        >
          <Input placeholder="请输入病人的姓名" />
        </FormItem>
        <FormItem
          name="gender"
          label="性别"
          rules={[
            {
              required: true,
              message: '请选择病人的性别！',
            },
          ]}
        >
          <RadioGroup>
            <Radio value="M">M</Radio>
            <Radio value="F">F</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem
          name="age"
          label="年龄"
          rules={[
            {
              required: true,
              type: 'number',
              min: 1,
              max: 120,
              message: '请输入合法的病人的年龄！',
            },
          ]}
        >
          <InputNumber style={{width: "100%"}} placeholder="请输入病人的年龄" />
        </FormItem>
        <FormItem
          name="expire_flag"
          label="状态"
          rules={[
            {
              required: true,
              message: '请选择病人的状态！',
            },
          ]}
        >
          <RadioGroup>
            <Radio value="0">健康</Radio>
            <Radio value="1">逝世</Radio>
          </RadioGroup>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button
            style={{
              float: 'left',
            }}
            onClick={backward}
          >
            上一步
          </Button>
          <Button onClick={() => handleModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => handleModalVisible(false)}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          下一步
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
      title="新增病人"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      afterClose={() => InitForm()}
      footer={renderFooter()}
    >
      <Steps
        style={{
          marginBottom: 28,
          width: 320,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        size="small"
        current={currentStep}
      >
        <Step title="基本信息" />
        <Step title="高级信息" />
      </Steps>
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
