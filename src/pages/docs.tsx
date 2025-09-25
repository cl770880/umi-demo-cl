import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Radio,
  message
} from 'antd';

const { Option } = Select;

const CreateAIClassModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [classType, setClassType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('表单数据:', values);
      message.success('课堂创建成功');
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setClassType('');
    onCancel();
  };

  const handleClassTypeChange = (e) => {
    setClassType(e.target.value);
  };

  return (
    <Modal
      title="创建AI课堂"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          label="课程名称"
          name="courseName"
          rules={[{ required: true, message: '请输入课程名称' },
            { max: 150, message: '课程名称不超过150个字' },
]}
        >
          <Input placeholder="请输入课程名称" maxLength={150}/>
        </Form.Item>

         <Form.Item
          label="课堂类型"
          name="classType"
          rules={[{ required: true, message: '请选择课堂类型' }]}
        >
          <Radio.Group onChange={handleClassTypeChange}>
              <Radio value="online">与线上课关联的课堂</Radio>
              <Radio value="offline">独立线下课堂</Radio>
          </Radio.Group>
        </Form.Item>

        {classType === 'online' && (
          <Form.Item
            label="关联课程"
            name="relatedCourse"
            rules={[{ required: true, message: '请选择关联课程' }]}
          >
            <Select placeholder="请选择关联课程">
              <Option value="course1">人工智能基础</Option>
              <Option value="course2">机器学习入门</Option>
              <Option value="course3">深度学习实战</Option>
              <Option value="course4">自然语言处理</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 使用示例
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        创建AI课堂
      </Button>
      <CreateAIClassModal 
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
      />
    </div>
  );
};

export default App;



