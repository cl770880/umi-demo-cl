
/**
 * 
 */

import React, { useState } from 'react';
import { Button, Empty, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import ClassroomCard from '../classroomCard/index'
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

interface classroomCard{
  classroomName: string,
  courseName: string,
  cover: string,
  originalSizeCover: string,
  termStartTime: string,
  termEndTime: string,
  detailUrl: string
};


const CourseSection: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [classrooms, setClassrooms] = useState<classroomCard[]>([]);

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
            image: 'https://img-blog.csdnimg.cn/img_convert/1ae9a4cfc235e04b3eaef65e17d2c5f2.jpeg',
        };
        setCourses([...courses, newCourse]);
    };

    const addClassroom = () => {
        const newClassroom: classroomCard = {
            classroomName: "Java程序设计课堂",
            courseName: "Java程序设计",
            cover: "https://img-blog.csdnimg.cn/img_convert/1ae9a4cfc235e04b3eaef65e17d2c5f2.jpeg",
            originalSizeCover: "https://img-blog.csdnimg.cn/img_convert/1ae9a4cfc235e04b3eaef65e17d2c5f2.jpeg",
            termStartTime: "2024-02-01",
            termEndTime: "2024-06-30",
            detailUrl: "/classroom/12345"
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
                        {classrooms.map(classroom=>(<ClassroomCard classroom={classroom} style={{width: '100px', margin: '16px'}}/>))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSection;