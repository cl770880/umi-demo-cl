import React, { useState } from 'react';
import StatusItem from './statusItem';
import s from './index.css';
import { Button } from 'antd';

// 定义状态项属性接口
interface StatusItemProps {
  text: string;
  isOk: boolean;
  pageUrl: string;
}

// 定义课程引导卡片属性接口
interface CourseGuideCardProps {
  title: string;
  statusItem: StatusItemProps[];
  showButton?: boolean;
}

const CourseGuideCard: React.FC<CourseGuideCardProps> = (props) => {
  const { title, statusItem, showButton } = props;
  // 修正state的初始类型，避免使用null（除非有特殊需求）
  const [state, setState] = useState<unknown>(null);
  
  // 修复事件处理函数，避免立即执行
  const handleGoUrl = (pageUrl: string) => {
    // 使用箭头函数包裹，防止页面加载时就执行
    return () => {
      location.href = pageUrl;
    };
  };

  return (
    <div className={s.courseGuideCard}>
      <span className={s.title}>{title}</span>
      <div className={s.statusContainerStyle}>
        {/* 修复map循环缺少返回值和key的问题 */}
        {statusItem.map((item, index) => {
          const { text, isOk, pageUrl } = item;
          // 添加return语句，确保组件被返回
          return (
            // 为循环项添加唯一key
            <div key={index} className={s.statusContainer}>
              <StatusItem text={text} isOk={isOk} />
              {/* 修复事件绑定方式，使用handleGoUrl返回的函数 */}
              <span 
                onClick={handleGoUrl(pageUrl)} 
                className={s.goButton}
              >
                {showButton ? '去设置'  : '去录入'}
              </span>
            </div>
          );
        })}
      </div>
      {showButton && (
        <div className={s.buttonContainer}>
          <Button type="primary" className={s.button}>课堂上课</Button>
        </div>
      )}
    </div>
  );
};

export default CourseGuideCard;
    