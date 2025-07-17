import React, { useState } from 'react';
import { Card, Tag, Button, Modal, Row, Col, Typography, Divider,QRCode } from 'antd';
import { ClockCircleOutlined, CloseOutlined } from '@ant-design/icons';
import './index.css';

// 课堂数据接口类型
interface ClassroomData {
  classroomId: number;
  classroomName: string;
  courseName: string;
  courseLectorName: string;
  coverPhoto: string;
  schoolName: string;
  schoolId: number;
  currentTermId: number;
  termStartTime: number;
  termEndTime: number;
  teachCaseLink?: string;
  teachCaseName?: string;
  // 扩展字段
  classroomCount?: number; // 课堂数量
  participantCount?: number; // 参与人数
  termProgress?: {
    class: string;
    icon: string;
    text: string;
  };
  courseCode?: string; // 课程码
}

interface ClassroomCardProps {
  classroom: ClassroomData;
  showClassroomCount?: boolean;
  description?: string;
  customCardStyle?: object;
  hiddenCertTag?: boolean;
  onClick?: (classroom: ClassroomData) => void;
}

const ClassRoomCard: React.FC<ClassroomCardProps> = ({
  classroom,
  onClick
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 生成课堂二维码的URL，实际中应该替换为后端提供的URL
  const generateQRCodeUrl = (classroomId: number) => {
    return `https://yourapp.com/classroom/${classroomId}`;
  };
  
  // 课程码，实际使用时应该从后端获取
  const courseCode = classroom.courseCode || "8J6TDW";
  
  const handleCardClick = () => {
    setIsModalVisible(true);
    if (onClick) {
      onClick(classroom);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  
  const { Text, Title } = Typography;
  
  return (
    <>
      <div className="course-card" onClick={handleCardClick}>
        <div className="card-image" style={{ backgroundImage: `url(${classroom.coverPhoto})`, backgroundSize: 'cover'}} >
        </div>
        <div className="card-content">
          <h3>{classroom.courseName}</h3>
          <p>{classroom.schoolName}</p>
          <p>{classroom.classroomCount}个课堂</p>
          <div className="card-info">
            <p className="participants">{classroom.courseLectorName}</p>
            <p className="status">
              <span className="status-icon"></span>
              {classroom.participantCount}人参加
            </p>
          </div>
        </div>
      </div>
      
      <Modal
        title={classroom.courseName}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        closeIcon={<CloseOutlined />}
        className="classroom-detail-modal"
      >
        <div className="classroom-detail-container">
          {/* 课堂信息列表 */}
          <div className="classroom-info-list">
            {[1, 2, 3].map((index) => (
              <div className="classroom-info-item" key={index}>
                <Row align="middle" className="info-row">
                  <Col span={8}>
                    <Text strong style={{ color: '#996633' }}>课堂名称XXX</Text>
                    <br />
                    <Text type="secondary">创建者: {classroom.courseLectorName}</Text>
                  </Col>
                  <Col span={16}>
                    <Row>
                      <Col span={12}>
                        <QRCode 
                          value={generateQRCodeUrl(classroom.classroomId)}
                          size={120}
                          level="H"
                        />
                      </Col>
                      <Col span={12}>
                        <div>
                          <Text strong>课堂码: {courseCode}</Text>
                          <br />
                          <Text type="secondary">课堂学生使用中国大学MOOC APP</Text>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {index < 3 && <Divider style={{ margin: '12px 0' }} />}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClassRoomCard;