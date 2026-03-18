import React, { useEffect, useState } from 'react';
import { Button, Card, Row, Col, Input, Avatar } from 'antd';
import CourseGuidePage from '../CourseGuid/index'
import { 
  FileTextOutlined,
  DatabaseOutlined,
  EditOutlined,
  MessageOutlined,
  ScanOutlined,
  ToolOutlined,
  SendOutlined,
  MoreOutlined
} from '@ant-design/icons';
import './index.css';

const { TextArea } = Input;

interface AIToolCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface AIWorkPlatformProps {
  termId?: number;
}

const AIWorkPlatform: React.FC<AIWorkPlatformProps> = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [isHasStudents, setIsHasStudents] = useState(false);

  // AI工具卡片数据
  const aiTools: AIToolCard[] = [
    {
      id: 'ai-ppt',
      title: 'AI生成PPT',
      subtitle: '提供慕课优质资源内容生成PPT',
      icon: <FileTextOutlined />,
      color: '#ff4d4f',
      bgColor: '#fff2f0'
    },
    {
      id: 'smart-db',
      title: '智慧课题库',
      subtitle: '助力高效备课开启智慧工具',
      icon: <DatabaseOutlined />,
      color: '#1890ff',
      bgColor: '#f0f8ff'
    },
    {
      id: 'ai-science',
      title: 'AI精准科技文',
      subtitle: '用一句话描述你想要的文章',
      icon: <EditOutlined />,
      color: '#722ed1',
      bgColor: '#f9f0ff'
    },
    {
      id: 'ai-dialogue',
      title: 'AI文档对话',
      subtitle: '快速解读课程文档的智能工具',
      icon: <MessageOutlined />,
      color: '#52c41a',
      bgColor: '#f6ffed'
    },
    {
      id: 'ai-translation',
      title: 'AI文档翻译',
      subtitle: '用一句话描述你要翻译的内容',
      icon: <ToolOutlined />,
      color: '#fa8c16',
      bgColor: '#fff7e6'
    },
    {
      id: 'ocr',
      title: 'OCR',
      subtitle: '用一句话描述你要上传的图片',
      icon: <ScanOutlined />,
      color: '#13c2c2',
      bgColor: '#e6fffb'
    }
  ];

  const handleToolClick = (tool: AIToolCard) => {
    console.log('点击工具:', tool.title);
    // 这里可以添加跳转逻辑或者打开工具的逻辑
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('发送内容:', inputValue);
      // 这里可以添加发送逻辑
      setInputValue('');
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(()=>{
    setIsHasStudents(true);
  },[])

  // 根据isHasStudents状态判断显示内容
  if (!isHasStudents) {
    return (
      <div className="ai-work-platform">
        <CourseGuidePage />
      </div>
    );
  }

  return (
    <div className="ai-work-platform">
      {/* 头部 */}
      <div className="header-content">
        <h1 className="platform-title">解读海量资源学情，AI辅助教学</h1>
        <div className="new-course-btn" onClick={() => {setIsHasStudents(false)}}>
          新手开课引导
        </div>
      </div>

      {/* AI工具区域 */}
      <div className="ai-tools-section">
        <h2 className="section-title">AI工具</h2>
        <div className="tools-grid">
          {aiTools.map((tool) => (
            
              <div 
                className="tool-card"
                onClick={() => handleToolClick(tool)}
                
              >
                <div className="tool-card-content">
                  <div 
                    className="tool-icon"
                    style={{ 
                      backgroundColor: tool.bgColor,
                      color: tool.color 
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div className="tool-info">
                    <h3 className="tool-title">{tool.title}</h3>
                    <p className="tool-subtitle">{tool.subtitle}</p>
                  </div>
                </div>
              </div>
            
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIWorkPlatform;
