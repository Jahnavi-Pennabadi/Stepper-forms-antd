import React, { useEffect, useState } from 'react';
import { Button, Input, message, Modal, Select, Steps, List, Form, Space, DatePicker, Row, Col, Card, Typography, Switch, Tag } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, ClockCircleOutlined, DeleteOutlined, MailOutlined, MinusOutlined, PhoneOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { BankOutlined } from '@ant-design/icons';

import duration from 'dayjs/plugin/duration';
import TextArea from 'antd/es/input/TextArea';

import './employeeform.css';
import dayjs from 'dayjs';

dayjs.extend(duration)
const { Title, Text } = Typography;

const FirstForm = ({ next, getValues, data, setdob, emptyVal }: any) => {
  let min = dayjs().subtract(18, 'years')
  let [form] = Form.useForm()
  if (emptyVal) {
    form.resetFields()
  }
  const onFinish = (val: any) => {

    let formattedVal = {
      name: val.name,
      email: val.email,
      phone: val.phone,
      dob: val.dob
    }
    setdob(val.dob.toISOString().slice(0, 10))
    getValues(formattedVal)
    next()
  }

  return (
    <div className='form1'>
      <Form form={form} layout="vertical" initialValues={!emptyVal && data} name="firstForm" onFinish={onFinish} requiredMark={true}>
        <h1 style={{ color: 'white', textAlign: 'center', paddingBottom: '20px' }} className='general'>General Details</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              hasFeedback
              rules={[
                { required: true, message: 'Please input your name!' },
                { min: 3, message: 'Name must be at least 3 characters!' },
                { max: 50, message: 'Name must be at most 50 characters!' },
                { pattern: /^[a-zA-Z ]+$/, message: 'Name must contain only alphabets or spaces' }

              ]}
            >
              <Input className='ant-input' prefix={<UserOutlined style={{ marginRight: "10px" }} />} maxLength={80} style={{ height: '44px' }} placeholder='Enter your name' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              hasFeedback
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please input a valid email!' },
                { max: 100, message: 'Email must be at most 100 characters!' },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/
                  , message: 'Enter a valid email @gmail.com'
                },
              ]}
            >
              <Input className='ant-input' maxLength={120} prefix={<MailOutlined style={{ marginRight: "10px" }} />} style={{ height: '44px' }} placeholder='Enter your email' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone No"
              name="phone"
              hasFeedback
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^[0-9]+$/, message: 'Phone number must contain digits only!' }

              ]}
            >
              <Input className='ant-input' maxLength={10} prefix={<PhoneOutlined style={{ marginRight: "10px" }} />} style={{ height: '44px' }} placeholder='Enter your phone number' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="DOB"
              name="dob"
              style={{ minWidth: "400px" }}
              hasFeedback
              rules={[
                { required: true, message: 'Please input your date of birth!' },
              ]}
            >
              <DatePicker className='ant-calendar-picker-input' disabledDate={(current) =>
                current && (current > min)
              } placeholder='Select your date of birth' style={{ minWidth: "98%", height: '44px' }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'end' }}>
          <Button type='primary' htmlType='submit' className='first-next-button'>Next<ArrowRightOutlined />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const SecondForm = ({ prev, next, setjoiningdate, getExperienceVal, setnewDate, emptyVal, experiencedata }: any) => {
  const [experience, setExperience] = useState('0');
  const [shownewJoinDate, setshownewJoinDate] = useState(false);
  const [joiningDate, setJoiningDates] = useState(null);
  const currentDate = dayjs();
  const max = dayjs();
  let [form] = Form.useForm();

  useEffect(() => {
    if (!emptyVal && experiencedata) {
      form.setFieldsValue(experiencedata);
      setExperience(experiencedata.experience || '0');
      if (experiencedata.noticePeriod === 'no') {
        setshownewJoinDate(true);
      }
    }
  }, [emptyVal, experiencedata, form]);

  const calculateExperience = (joiningDate: any) => {
    if (joiningDate) {
      const experienceYears = currentDate.diff(joiningDate, 'year');
      const experienceMonths = currentDate.diff(joiningDate, 'month');
      const experienceDays = currentDate.diff(joiningDate, 'day');

      if (experienceYears > 0) {
        setExperience(`${experienceYears} Years`);
      } else if (experienceMonths > 0) {
        setExperience(`${experienceMonths} Months`);
      } else {
        setExperience(`${experienceDays} Days`);
      }
    } else {
      setExperience('0');
    }
  };

  const onFinish = (values: any) => {
    const joiningDate = values.joiningDate ? dayjs(values.joiningDate) : null;
    calculateExperience(joiningDate);

    const formattedVal = {
      companyName: values.companyName,
      joiningDate: values.joiningDate,
      skills: values.skills,
      noticePeriod: values.noticePeriod,
      experience: experience,
      newJoiningDate: values.newJoiningDate,
    };

    if (joiningDate) {
      setjoiningdate(joiningDate.toISOString().slice(0, 10));
    }
    getExperienceVal(formattedVal);
    next();

    if (values.newJoiningDate) {
      setnewDate(values.newJoiningDate.toISOString().slice(0, 10));
    }
  };

  const goToPreviousPage = () => {
    prev();
  };

  const getNoticePeriod = (val: any) => {
    if (val === 'no') {
      setshownewJoinDate(true);
    } else {
      setshownewJoinDate(false);
    }
  };

  const handleChange = (data:any) => {
     calculateExperience(data)
     setJoiningDates(data)
  }

  return (
    <div>
      <Form layout="vertical" form={form} name="secondForm" initialValues={!emptyVal && experiencedata} requiredMark={true} onFinish={onFinish}>
        <h1 style={{ color: 'white', textAlign: 'center', paddingBottom: '10px' }} className='general'>Experience</h1>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: 'Please input your company name!' }]}
            >
              <Input className='ant-input' style={{ height: '44px' }} placeholder="Enter your company name" prefix={<BankOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Joining Date"
              name="joiningDate"
              
              rules={[{ required: true, message: 'Please input your joining date!' }]}
            >
              <DatePicker className='ant-calendar-picker-input'
                placeholder="Select your joining date"
                style={{ width: "100%", height: '44px' }}
                value={joiningDate}
                disabledDate={(current) => current && current > max}
                onChange={(date) => handleChange(date)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Skills"
              name="skills"
              rules={[{ required: true, message: 'Please select your skills!' }]}
            >
              <Select className='ant-select-selector' style={{ height: '44px', color: 'white' }} placeholder="Select your skills" mode="multiple">
                <Select.Option value="javascript">JavaScript</Select.Option>
                <Select.Option value="python">Python</Select.Option>
                <Select.Option value="java">Java</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className='ant-input' label="Experience" name="experience">
              <Typography.Paragraph style={{ color: 'white', fontWeight: 'bold', fontSize: "20px" }}>{experience}</Typography.Paragraph>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Notice Period"
              name="noticePeriod"
              rules={[{ required: true, message: 'Please input your notice period!' }]}
            ><Select
              placeholder={<span style={{ color: 'white' }}>Enter Notice Period</span>}
              style={{
                height: '44px',
                color: 'white',
              }}
              onChange={getNoticePeriod}
            >
                <Select.Option value="15 days">15 days</Select.Option>
                <Select.Option value="1 month">1 month</Select.Option>
                <Select.Option value="2 months">2 months</Select.Option>
                <Select.Option value="3 months">3 months</Select.Option>
                <Select.Option value="no">No</Select.Option>
              </Select>

            </Form.Item>
          </Col>
          <Col span={12}>
            {shownewJoinDate && (
              <Form.Item name="newJoiningDate" label="New Joining Date" rules={[{ required: true, message: "Please choose the new joining date" }]}>
                <DatePicker className='ant-calendar-picker-input'
                  style={{ minWidth: "98%", height: '44px' }} 
                  disabledDate={(current) => current && current < dayjs()}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        <div className="button-container">
          <Button onClick={goToPreviousPage} type='primary'><ArrowLeftOutlined />Previous</Button>
          <Button htmlType="submit" type="primary">Next<ArrowRightOutlined /></Button>
        </div>
      </Form>
    </div>
  );
};


const ThirdForm = ({ prev, getPersonalData, setModal, emptyVal, setEmptyVal, personalData }: any) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (val: any) => {
    console.log(val);
    message.success('Complete!');
    let formattedVal = {
      hobbies: val.hobbies,
      hobbiesList: val.hobbiesList ? [...val.hobbiesList] : [],
    };
    getPersonalData(formattedVal);
    console.log(formattedVal);
    setModal(true);
    form.resetFields()
    setEmptyVal(true)
    setShowAchievement(false)

  };

  const goToPreviousPage = () => {
    prev();
  };


  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        name="thirdForm"
        requiredMark={true}
        onFinish={onFinish}
        initialValues={!emptyVal && personalData}

      >
        <h1 style={{ color: 'white', textAlign: 'center', paddingBottom: '20px' }} className='general'>Personal Details</h1>

        <Form.Item
          label="Hobbies"
          name="hobbies"
          rules={[{ required: true, message: 'Please select your hobbies!' }]}
        >
          <Select style={{ height: '44px', color: "white" }} placeholder='Select Your Hobbies' className='ant-select-selector ant-select-selection-placeholder' mode="multiple">
            <Select.Option value="reading">Reading</Select.Option>
            <Select.Option value="sports">Sports</Select.Option>
            <Select.Option value="traveling">Traveling</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Typography.Paragraph style={{ color: 'white', fontSize: "15px" }}>Do you have achievements?</Typography.Paragraph>
          <Switch checked = {showAchievement} onChange={() => setShowAchievement(!showAchievement)} />
        </Form.Item>
        {showAchievement && (
          <Form.List name="hobbiesList">
            {(fields, { add, remove }) => (
              
              <Form.Item className="add-hobby-btn">
                  <div className="add-achievement">
                    <Typography.Paragraph style={{ fontSize: '15px',marginRight : "20px",marginTop : "22px" }}>Achievements</Typography.Paragraph>
                    <Button type="dashed" onClick={() => add()}>
                      <PlusOutlined />
                    </Button>
                  </div>
                
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'hobby']}
                        rules={[{ required: true, message: 'Missing Achievement' }]}
                      >
                        <TextArea className="textarea" placeholder="Add an Achievement" />
                      </Form.Item>
                      <Button
                        type="primary"
                        style={{ backgroundColor: "transparent", marginBottom: '15px', border: '1px solid white' }}
                        onClick={() => remove(name)}
                      ><DeleteOutlined /></Button>
                    </Space>
                  ))}
               
              </Form.Item>
            )}
          </Form.List>
        )}

        <div className="button-container">
          <Button onClick={goToPreviousPage}><ArrowLeftOutlined />Previous</Button>
          <Button htmlType="submit">Done</Button>
        </div>
      </Form>
    </div>
  );
};



const EmployeeForm: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [dob, setdob] = useState('')
  const [joiningdate, setjoiningdate] = useState('')
  const [emptyVal, setEmptyVal] = useState(false)
  const [newDate, setnewDate] = useState(false)
  const [slideClass, setSlideClass] = useState('');

  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: ''
  })
  const [experiencedata, setExperienceData] = useState({
    companyName: '',
    joiningDate: '',
    experience: '',
    noticePeriod: '',
    newjoiningDate: '',
    skills: []
  })
  let [personalData, setPersonalData] = useState({
    hobbies: [],
    hobbiesList: []

  })
  const [getModal, setModal] = useState(false)

  const next = () => {
    setCurrent(current + 1);
    setSlideClass('step-slide-left');
  };

  const prev = () => {
    setCurrent(current - 1);
    setSlideClass('step-slide-left');

  };

  const handleOk = () => {
    setEmptyVal(true)
    setModal(false);

  };

  const handleCancel = () => {
    setModal(false);
  };

  const getValues = (val: any) => {
    setData((prevState) => ({ ...prevState, ...val }))
  }

  const getExperienceVal = (val: any) => {
    setExperienceData((prevState) => ({ ...prevState, ...val }))
  }

  const getPersonalData = (val: any) => {
    setPersonalData((prevState) => ({ ...prevState, ...val }))
  }


  const steps = [
    { title: 'General', content: <FirstForm next={next} getValues={getValues} emptyVal={emptyVal} data={data} setdob={setdob} /> },
    { title: 'Experience', content: <SecondForm prev={prev} next={next} setnewDate={setnewDate} emptyVal={emptyVal} setjoiningdate={setjoiningdate} getExperienceVal={getExperienceVal} experiencedata={experiencedata} /> },
    { title: 'Personal', content: <ThirdForm prev={prev} setEmptyVal={setEmptyVal} emptyVal={emptyVal} getPersonalData={getPersonalData} setModal={setModal} personalData={personalData} /> },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="app-container">
      <h1 style={{ textAlign: 'center', color: "white", zIndex: 1 }}>EMPLOYEE FORM</h1>
      <div style={{ width: "1300px" }} >
        <Steps className='stepper' current={current} items={items} />
      </div>
      <Modal
  title="  "
  open={getModal}
  onOk={handleOk}
  onCancel={handleCancel}
  className="modal-container"
>
  <h1 style={{ textAlign: "center", color: "white" }}>Employee Details</h1>
  
  <Title level={4} className="card-title">General Info</Title>
  <Card className="card-container">
    <div className="apn-container">
      <Text className="card-text">Name  : <span className="value">{data.name}</span></Text><br />
      <Text className="card-text">Email  : <span className="value">{data.email}</span></Text><br />
      <Text className="card-text">Phone  : <span className="value">{data.phone}</span></Text><br />
      <Text className="card-text">DOB  : <span className="value">{dob}</span></Text>
    </div>
  </Card>
  
  <Title level={4} className="card-title">Experience Info</Title>
  <Card className="card-container">
    <div className="apn-container">
      <Text className="card-text">Company Name  : <span className="value">{experiencedata.companyName}</span></Text><br />
      <Text className="card-text">Experience  : <span className="value">{experiencedata.experience}</span></Text><br />
      <Text className="card-text">Skills  :</Text>
      <List
        dataSource={experiencedata.skills}
        renderItem={(item) => (
          <List.Item className="card-list-item">
            <Tag style={{height:'30px'}} closeIcon={<ClockCircleOutlined />} onClose={console.log}>
              <span style = {{fontSize : "15px"}}>{item}</span>
            </Tag>
          </List.Item>
        )}
        bordered
        size="small"
        className="card-list"
      />
      <Text className="card-text">Joining Date  : <span className="value">{joiningdate}</span></Text><br />
      <Text className="card-text">Notice Period  : <span className="value">{experiencedata.noticePeriod}</span></Text><br />
      {experiencedata.noticePeriod === 'no' && (
        <Text className="new-joining-date">New Joining Date: {newDate}</Text>
      )}
    </div>
  </Card>
  
  <Title level={4} className="card-title">Personal Info</Title>
  <Card className="card-container">
    <div className="apn-container">
      <Text className="card-text">Hobbies:</Text>
      <List
        dataSource={personalData.hobbies}
        renderItem={(item) => (
          <List.Item className="card-list-item">{item}</List.Item>
        )}
        bordered
        size="small"
        className="card-list"
      />
      <Text className="card-text">Achievements:</Text>
      <List
        dataSource={personalData.hobbiesList || []}
        renderItem={(item:any, index) => (
          <List.Item key={index} className="card-list-item">{item.hobby}</List.Item>
        )}
        bordered
        size="small"
        className="card-list"
      />
    </div>
  </Card>
</Modal>


      <div className="step-container">
        <div className={`step-content ${slideClass}`}>
          {steps[current].content}

        </div>
      </div>
    </div>

  );
};

export default EmployeeForm;
