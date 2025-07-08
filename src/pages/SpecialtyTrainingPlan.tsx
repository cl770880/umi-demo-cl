import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography, Row, Col, Tabs, Card } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

// 表单布局配置
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const TrainingPlanForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单提交数据:', values);
  };

  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="专业培养方案" key="1">
          <Form 
            form={form}
            name="training_plan_form"
            onFinish={onFinish}
            {...formItemLayout}
            autoComplete="off"
          >
            <Title level={5} >培养目标</Title>
            
            {/* 培养目标介绍 */}
            <Form.Item
              label="培养目标介绍"
              name="trainingGoalIntro"
              rules={[
                { required: true, message: '请输入培养目标介绍' },
                { max: 300, message: '培养目标介绍不能超过300字' }
              ]}
            >
              <TextArea 
                placeholder="请输入培养目标介绍"
                showCount
                maxLength={300}
                style={{width:'50%'}}
                autoSize={{ minRows: 4, maxRows: 6 }}
              />
            </Form.Item>

            {/* 培养目标列表 */}
            <Form.List
              name="trainingGoals"
              rules={[
                {
                  validator: async (_, goals) => {
                    if (!goals || goals.length < 1) {
                      return Promise.reject(new Error('至少添加一个培养目标'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <div key={field.key} style={{ position: 'relative', marginBottom: 24 }}>
                      <Form.Item
                        label="培养目标"
                        name={[field.name, 'title']}
                        
                        rules={[
                          { required: true, message: '请输入培养目标' },
                          { max: 50, message: '培养目标不能超过50字' }
                        ]}
                      >
                        <Input placeholder="请输入培养目标" style={{ width: '50%'}} />
                      </Form.Item>
                      
                      <Form.Item
                        label="培养目标描述"
                        name={[field.name, 'description']}
                        rules={[
                          { required: true, message: '请输入培养目标描述' },
                          { max: 500, message: '培养目标描述不能超过500字' }
                        ]}
                      >
                        <TextArea 
                          placeholder="请输入培养目标描述" 
                          showCount
                          maxLength={500}
                          style={{ width: '50%'}}
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      </Form.Item>
                      
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: -24,
                            color: '#ff4d4f'
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: '60%' }}
                      icon={<PlusOutlined />}
                    >
                      增加培养目标
                    </Button>
                     <Button type="primary" htmlType="submit" style={{ float:'right', width:'10%' }}>
                保存
              </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
             
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="专业知识课程" key="2">
          专业知识课程内容
        </TabPane>
        <TabPane tab="专业能力课程" key="3">
          专业能力课程内容
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TrainingPlanForm;