import React from 'react';
import { Card, Tag, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import '../CourseCard/index.css';

interface CourseCardProps {
  title: string;
  subtitle: string;
  school: string;
  teacher: string;
  status: 'ongoing' | 'finished';
  week?: number;
  participants: number;
  image: string;
  onDelete: () => void;
  onSetting: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  subtitle,
  school,
  teacher,
  status,
  week,
  participants,
  image,
  onDelete,
  onSetting
}) => {
  return (
    <Card
      cover={
        <div className="card-cover">
          <img alt={title} src={image} />
          <Tag color="#f50" className="card-tag">国家精品</Tag>
          <div className="card-subtitle">{subtitle}</div>
        </div>
      }
      className="course-card"
    >
      <div className="card-content">
        <h3>{title}</h3>
        <p>{school}</p>
        <p>{teacher}</p>
        <div className="course-status">
          {status === 'ongoing' ? (
            <span className="ongoing">
              <ClockCircleOutlined /> 进行至第{week}周
            </span>
          ) : (
            <span className="finished">已结束</span>
          )}
          <span className="participants">{participants}人参加</span>
        </div>
      </div>
      <div className="card-actions">
        <Button danger onClick={onDelete}>删除</Button>
        <Button type="primary" onClick={onSetting}>设置前后序</Button>
      </div>
    </Card>
  );
};

export default CourseCard;