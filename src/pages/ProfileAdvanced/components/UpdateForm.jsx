import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, InputNumber } from 'antd';
import { AlignCenterOutlined } from '@ant-design/icons';

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

const UpdateForm = props => {
  const [formVals, setFormVals] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [edregVisible, setEdregVisible] = useState(false);
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    //const fieldsValue = await form.validateFields();
    form.validateFields().then(values => {
      let newFormVals = Object.assign({}, formVals, values);
      newFormVals.age = parseInt(newFormVals.age);
      setFormVals({ ...newFormVals });

      if (currentStep < 2) {
        forward();
      } else {
        handleUpdate({ ...newFormVals });
      }  
    })
  };

  const InitForm = () => {
    setCurrentStep(0);
  }

  const renderContent = () => {
    if (currentStep === 2) {
      return (
        <>
          <FormItem
            name="edreg_flag"
            label="进入急诊室"
            rules={[
              {
                required: true,
                message: '请选择病人是否进入过急诊室！',
              },
            ]}
          >
            <RadioGroup>
              <Radio value="0">是</Radio>
              <Radio value="1">否</Radio>
            </RadioGroup>
          </FormItem>
          {edregVisible ? (
            <>
              <Form.Item
                name="edregtime"
                label="进入急诊室时间"
              >
                <DatePicker showTime placeholder="请选择进入急诊室时间" />
              </Form.Item>
              <Form.Item
                name="edouttime"
                label="离开急诊室时间"
              >
                <DatePicker showTime placeholder="请选择离开急诊室时间" />
              </Form.Item>
            </>     
          ) : null}
        </>
      )
    }

    if (currentStep === 1) {
      return (
        <>
          <FormItem 
            name="admittime" 
            label="入院时间"
            rules={[
              {
                required: true,
                message: '请选择病人的入院时间！',
              },
            ]}
          >
            <DatePicker showTime placeholder="请选择入院时间" />
          </FormItem>
          <FormItem 
            name="admission_location" 
            label="入院地点"
            rules={[
              {
                required: true,
                message: '请选择病人的入院地点！',
              },
            ]}
          >
            <Select
              style={{
                width: '100%',
              }}
              placeholder="请选择入院地点"
            >
              <Option value="EMERGENCY ROOM ADMIT">EMERGENCY ROOM ADMIT</Option>
              <Option value="TRANSFER FROM HOSP/EXTRAM">TRANSFER FROM HOSP/EXTRAM</Option>
              <Option value="CLINIC REFERRAL/PREMATURE">CLINIC REFERRAL/PREMATURE</Option>
              <Option value="PHYS REFERRAL/NORMAL DELI">PHYS REFERRAL/NORMAL DELI</Option>
              <Option value="TRANSFER FROM OTHER HEALT">TRANSFER FROM OTHER HEALT</Option>
              <Option value="TRANSFER FROM SKILLED NUR">TRANSFER FROM SKILLED NUR</Option>
            </Select>
          </FormItem>
          <FormItem 
            name="dischtime" 
            label="出院时间"
            rules={[
              {
                required: true,
                message: '请选择病人的出院时间！',
              },
            ]}
          >
            <DatePicker showTime placeholder="请选择出院时间" />
          </FormItem>
          <FormItem
            name="discharge_location"
            label="出院地点"
            rules={[
              {
                required: true,
                message: '请输入病人的出院地点！',
              },
            ]}
          >
            <Input placeholder="请输入出院地点" />
          </FormItem>
          <FormItem
            name="hospital_expire_flag"
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
          {visible ? (
            <Form.Item
              name="deathtime"
              label="死亡时间"
              rules={[
                {
                  required: true,
                  message: '请选择病人的死亡时间！',
                },
              ]}  
            >
              <DatePicker showTime placeholder="请选择死亡时间" />
            </Form.Item>
            ) : null
          }
        </>
      );
    }

    return (
      <>
        <FormItem
          name="subject_id"
          label="病人编号"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={props.subject_id}
        >
          <Input disabled />
        </FormItem>
        <FormItem
          name="admission_type"
          label="住院类型"
          rules={[
            {
              required: true,
              message: '请选择病人的住院类型！',
            },
          ]}
        >
          <RadioGroup>
            <Radio value="EMERGENCY">EMERGENCY</Radio>
            <Radio value="URGENT">URGENT</Radio>
            <Radio value="ELECTIVE">ELECTIVE</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem 
          name="insurance" 
          label="保险"
          rules={[
            {
              required: true,
              message: '请选择病人的保险类型！',
            },
          ]}
        >
          <Select
            style={{
              width: '100%',
            }}
            placeholder="请选择保险类型"
          >
            <Option value="Medicare">Medicare</Option>
            <Option value="Private">Private</Option>
            <Option value="Medicaid">Medicaid</Option>
            <Option value="Government">Government</Option>
            <Option value="Self Pay">Self Pay</Option>
          </Select>
        </FormItem>
        <FormItem
          name="diagnosis"
          label="诊断信息"
        >
          <TextArea rows={3} placeholder="请输入病人的诊断信息" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 2) {
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
      )
    }

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
          <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
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
        padding: '32px 35px 48px',
      }}
      destroyOnClose
      title="修改住院记录"
      visible={updateModalVisible}
      footer={renderFooter()}
      afterClose={() => InitForm()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Steps
        style={{
          marginBottom: 28,
          width: 570,
        }}
        size="small"
        current={currentStep}
      >
        <Step title="基本信息" />
        <Step title="住院信息" />
        <Step title="急诊信息" />
      </Steps>
      <Form.Provider
        onFormChange={(name, { changedFields, forms }) => {
          let field = changedFields.length != 0 ? changedFields[0].name[0] : null;
          let value = changedFields.length != 0 ? changedFields[0].value : null;
          if(field == "hospital_expire_flag") {
            if(value == 0){
              setVisible(false);
            } else if (value == 1){
              setVisible(true);
            }
          }
          if(field == "edreg_flag") {
            if(value == 0){
              setEdregVisible(true);
            } else if (value == 1){
              setEdregVisible(false);
            }
          }
        }}
      >
        <Form
          {...formLayout}
          form={form}
          initialValues={{
            language: formVals.language,
            religion: formVals.religion,
            marital_status: formVals.marital_status,
            ethnicity: formVals.ethnicity,
            expire_flag: formVals.expire_flag,
            name: formVals.name,
            gender: formVals.gender,
            age: formVals.age,
          }}
        >
          {renderContent()}
        </Form>
      </Form.Provider>
    </Modal>
  );
};

export default UpdateForm;
