
/**
 * 
 */

import React, { useState } from 'react';
import { Button, Empty, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.css';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  school: string;
  teacher: string;
  status: string;
  week: number;
  participants: number;
  image: string;
}

const CourseSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classrooms, setClassrooms] = useState<Course[]>([]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: '心理学：我知无不言，它妙不可言',
      subtitle: '认知学习',
      school: '华中师范大学',
      teacher: '田媛',
      status: 'ongoing',
      week: 12,
      participants: 9489,
      image: 'https://example.com/course-image.jpg',
    };
    setCourses([...courses, newCourse]);
  };

  const addClassroom = () => {
    const newClassroom: Course = {
      id: Date.now().toString(),
      title: '中国哲学',
      subtitle: '认证学习',
      school: '北京师范大学',
      teacher: '董伟文',
      status: 'ongoing',
      week: 15,
      participants: 9454,
      image: 'https://example.com/classroom-image.jpg',
    };
    setClassrooms([...classrooms, newClassroom]);
  };

  const renderCourseCard = (course: Course) => (
     <div className="course-card">
    <div className="card-image" style={{ backgroundImage: `url(${course.image})` }}>
      <div className="card-tag">{course.subtitle}</div>
    </div>
    <div className="card-content">
      <h3>{course.title}</h3>
      <p>{course.school}</p>
      <p>{course.teacher}</p>
      <div className="card-info">
        <p className="status">
          <span className="status-icon"></span>
          {course.status === 'ongoing' ? `进行至第${course.week}周` : '已结束'}
        </p>
        <p className="participants">{course.participants}人参加</p>
      </div>
    </div>
    <div className="card-actions">
      <Button>删除</Button>
      <Button>设置前后序</Button>
    </div>
  </div>
  );

  return (
    <div className="course-section">
      <div className="course-list">
        <h2>课程</h2>
        <Button icon={<PlusOutlined />} onClick={addCourse}>添加课程</Button>
        {courses.length === 0 ? (
          <Empty description="暂无课程" />
        ) : (
          <div className="card-list">
            {courses.map(renderCourseCard)}
          </div>
        )}
      </div>
      <div className="classroom-list">
        <h2>课堂</h2>
        <Button icon={<PlusOutlined />} onClick={addClassroom}>添加课堂</Button>
        {classrooms.length === 0 ? (
          <Empty description="暂无课堂" />
        ) : (
          <div className="card-list">
            {classrooms.map(renderCourseCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSection;