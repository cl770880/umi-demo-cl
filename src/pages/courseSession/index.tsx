import React, { useState } from 'react';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// import ClassroomCard from '../classroomCard/index';
import ClassRoomCard from '../roomCard/index';
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

interface classroomCard {
  classroomId: number,
  classroomName: string,
  courseName: string,
  courseLectorName: string,
  coverPhoto: string,
  schoolName: string,
  schoolId: number,
  currentTermId: number,
  termStartTime: number,
  termEndTime: number,
  classroomCount: number,
  participantCount: number,
  topTags: string[],
  termProgress: {
    class: string,
    icon: string,
    text: string
  }
};



const CourseSection: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [classrooms, setClassrooms] = useState<classroomCard[]>([]);

    const addCourse = () => {
        const newCourse: Course = {
            id: Date.now().toString(),
            title: '心理学：我知无',
            subtitle: '认知学习',
            school: '华中师范大学',
            teacher: '田媛',
            status: 'ongoing',
            week: 12,
            participants: 9489,
            image: 'https://edu-image.nosdn.127.net/FE60E8703D71E540BC5BA850E7FF895C.jpg',
        };
        setCourses([...courses, newCourse]);
    };

    const addClassroom = () => {
    const newClassroom: classroomCard = {
    classroomId: 1,
    classroomName: "环境工程微生物学课堂dedgeudueyydueydgec黄毒蛾有很多也",
    courseName: "环境工程微生物学",
    courseLectorName: "吴林江",
    coverPhoto: "https://img-blog.csdnimg.cn/img_convert/1ae9a4cfc235e04b3eaef65e17d2c5f2.jpeg",
    schoolName: "青岛建筑科技大学",
    schoolId: 123,
    currentTermId: 456,
    termStartTime: 1640995200000,
    termEndTime: 1672531200000,
    classroomCount: 3,
    participantCount: 152,
    topTags: ["国家精品"],
    termProgress: {
      class: "going",
      icon: "/icons/going.png",
      text: "进行中"
    }
  };
        setClassrooms([...classrooms, newClassroom]);
    };

    const renderCourseCard = (course: Course) => (
        <div className="course-card">
            <div className="card-image" style={{ backgroundImage: `url(${course.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
        </div>
    );

    return (
        <div className="course-section">
            <div className="course-list">
                <h2>课程</h2>
                <Button style={{marginBottom: 10}} icon={<PlusOutlined />} onClick={addCourse}>添加课程</Button>
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
                <Button style={{marginBottom: 10}} icon={<PlusOutlined />} onClick={addClassroom}>添加课堂</Button>
                {classrooms.length === 0 ? (
                    <Empty description="暂无课堂" />
                ) : (
                    <div className="card-list">
                        {classrooms.map(classroom=>(<ClassRoomCard classroom={classroom} />))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSection;