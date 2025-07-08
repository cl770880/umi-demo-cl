import React, { useState } from 'react';
import { Tabs, Input, Upload, Button, message, Form, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './SpecialtyEdit.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const SpecialtyEdit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [activeCourseTab, setActiveCourseTab] = useState('1');
  const [selectedSemester, setSelectedSemester] = useState('1');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleCourseTabChange = (key: string) => {
    setActiveCourseTab(key);
  };

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
  };

  const handleBackgroundUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  return (
    <div className="specialty-edit">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="专业信息" key="1">
          <Form layout="vertical">
            <Form.Item label="专业名称">
              <Input placeholder="请输入专业名称" />
            </Form.Item>
            <Form.Item label="背景图">
              <Upload
                name="background"
                action="/upload.do"
                onChange={handleBackgroundUpload}
              >
                <Button icon={<UploadOutlined />}>更换背景图</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="专业介绍">
              <TextArea rows={4} placeholder="请输入专业介绍" />
            </Form.Item>
          </Form>
          <div className="course-group">
            <h3>专业课程群</h3>
            <div className="semester-courses">
              <div className="semesters">
                {[...Array(10)].map((_, index) => (
                  <Button
                    key={index + 1}
                    type={selectedSemester === (index + 1).toString() ? 'primary' : 'default'}
                    onClick={() => handleSemesterChange((index + 1).toString())}
                  >
                    第{index + 1}学期
                  </Button>
                ))}
              </div>
              <div className="courses">
                <Tabs activeKey={activeCourseTab} onChange={handleCourseTabChange}>
                  <TabPane tab="学科基础课" key="1">
                    学科基础课内容
                  </TabPane>
                  <TabPane tab="专业必修课" key="2">
                    专业必修课内容
                  </TabPane>
                  <TabPane tab="专业选修课" key="3">
                    专业选修课内容
                  </TabPane>
                  <TabPane tab="实践课" key="4">
                    实践课内容
                  </TabPane>
                </Tabs>
              </div>
            </div>
            <div className="actions">
              <Button type="primary">保存</Button>
            </div>
          </div>
        </TabPane>
        <TabPane tab="专业培养方案" key="2">
          专业培养方案内容
        </TabPane>
        <TabPane tab="专业知识图谱" key="3">
          专业知识图谱内容
        </TabPane>
        <TabPane tab="专业能力图谱" key="4">
          专业能力图谱内容
        </TabPane>
      </Tabs>

      
    </div>
  );
};

export default SpecialtyEdit;