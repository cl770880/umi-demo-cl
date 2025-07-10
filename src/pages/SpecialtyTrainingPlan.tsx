// TrainingPlanForm.tsx
import React, { useState, useEffect } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import MatrixTable from './majorRelative';
import CourseAbilityRelation from './courseRelative/index'
import { Button, Form, Input, Typography, Row, Col, Tabs, Card, Space, Divider, message } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;
const { TabPane } = Tabs;

// 定义培养目标接口
interface TrainingGoal {
  title: string;
  description: string;
}

// 定义子能力接口
interface SubAbility {
  name: string;
}

// 定义毕业能力要求接口
interface GraduationAbility {
  ability: string;
  description: string;
  subAbilities: SubAbility[];
}

// 表单布局配置
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const TrainingPlanForm: React.FC = () => {
  // 添加模拟课程数据（实际项目中应从API获取）

  const [form] = Form.useForm();
  
  // 状态用于存储已保存的培养目标和毕业能力要求
  const [savedTrainingGoals, setSavedTrainingGoals] = useState<TrainingGoal[]>([]);
  const [savedGraduationAbilities, setSavedGraduationAbilities] = useState<GraduationAbility[]>([]);
  
  // 组件加载后初始化默认数据
  useEffect(() => {
    // 设置默认的培养目标和毕业能力要求数据
    form.setFieldsValue({
      trainingGoals: [
        {
          title: '',
          description: ''
        }
      ],
      graduationAbilities: [
        {
          ability: '',
          description: '',
          subAbilities: [
            {
              name: ''
            }
          ]
        }
      ]
    });
  }, [form]);

  // 保存培养目标
  const saveTrainingGoals = async () => {
    try {
      // 校验培养目标相关字段
      const values = await form.validateFields(['trainingGoalIntro', 'trainingGoals']);
      console.log('保存培养目标数据:', values);
      
      // 保存培养目标数据到状态中
      setSavedTrainingGoals(values.trainingGoals);
      
      message.success('培养目标保存成功');
    } catch (errorInfo) {
      console.log('培养目标校验失败:', errorInfo);
      message.error('培养目标校验失败，请检查表单');
    }
  };

  // 保存毕业能力要求
  const saveGraduationAbilities = async () => {
    try {
      // 校验毕业能力要求相关字段
      const values = await form.validateFields(['graduationAbilities']);
      console.log('保存毕业能力要求数据:', values);
      
      // 保存毕业能力要求数据到状态中
      setSavedGraduationAbilities(values.graduationAbilities);
      
      message.success('毕业能力要求保存成功');
    } catch (errorInfo) {
      console.log('毕业能力要求校验失败:', errorInfo);
      message.error('毕业能力要求校验失败，请检查表单');
    }
  };

  return (
    <div>
      <Form 
        form={form}
        name="training_plan_form"
        {...formItemLayout}
        autoComplete="off"
        initialValues={{
          trainingGoals: [
            {
              title: '',
              description: ''
            }
          ],
          graduationAbilities: [
            {
              ability: '',
              description: '',
              subAbilities: [
                {
                  name: ''
                }
              ]
            }
          ]
        }}
      >
        {/* 培养目标部分 */}
        <Title level={5}>培养目标</Title>
        
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
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '200px' }}
                    icon={<PlusOutlined />}
                  >
                    增加培养目标
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={saveTrainingGoals}
                  >
                    保存
                  </Button>
                </Space>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* 毕业能力要求部分 */}
        <Divider />
        <Title level={5}>毕业能力要求</Title>

        {/* 毕业能力要求列表 */}
        <Form.List
          name="graduationAbilities"
          rules={[
            {
              validator: async (_, abilities) => {
                if (!abilities || abilities.length < 1) {
                  return Promise.reject(new Error('至少添加一个毕业能力要求'));
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
                    label="能力"
                    name={[field.name, 'ability']}
                    rules={[
                      { required: true, message: '请输入能力' },
                      { max: 50, message: '能力名称不能超过50字' }
                    ]}
                  >
                    <Input placeholder="请输入能力值" style={{ width: '50%'}} />
                  </Form.Item>
                  
                  <Form.Item
                    label="能力描述"
                    name={[field.name, 'description']}
                    rules={[
                      { required: true, message: '请输入能力描述' },
                      { max: 500, message: '能力描述不能超过500字' }
                    ]}
                  >
                    <TextArea 
                      placeholder="请输入能力描述" 
                      showCount
                      maxLength={500}
                      style={{ width: '50%'}}
                      autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                  </Form.Item>
                  
                  {/* 子能力部分 */}
                  <Form.Item label="子能力点">
                    <Form.List name={[field.name, 'subAbilities']}>
                      {(subFields, subOpt, { errors }) => (
                        <div style={{ marginBottom: 16 }}>
                          {subFields.map(subField => (
                            <Space key={subField.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...subField}
                                name={[subField.name, 'name']}
                                rules={[{ required: true, message: '请输入子能力' }]}
                                noStyle
                              >
                                <Input placeholder="请输入子能力点" style={{ width: 300 }} />
                              </Form.Item>
                              <MinusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => subOpt.remove(subField.name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => subOpt.add()}
                              style={{ width: '60%' }}
                              icon={<PlusOutlined />}
                            >
                              增加子能力点
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </div>
                      )}
                    </Form.List>
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
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '200px' }}
                    icon={<PlusOutlined />}
                  >
                    增加能力
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={saveGraduationAbilities}
                  >
                    保存
                  </Button>
                </Space>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
      
      {/* 将保存后的培养目标和毕业能力要求数据传递给矩阵表格组件 */}
      <MatrixTable 
        trainingGoals={savedTrainingGoals} 
        graduationAbilities={savedGraduationAbilities} 
      />
    </div>
  );
};

export default TrainingPlanForm;