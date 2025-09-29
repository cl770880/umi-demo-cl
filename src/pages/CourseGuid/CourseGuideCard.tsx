import React from 'react';
import { Button } from 'antd';
import StatusItem from './statusItem';
import { CourseGuideCardProps, GuideItem } from './types';
import s from './index.css';

const CourseGuideCard: React.FC<CourseGuideCardProps> = ({
  title,
  items,
  showMainButton = false,
  mainButtonText = '课堂上课',
  onMainButtonClick,
  className = ''
}) => {
  
  const handleGoUrl = (pageUrl: string) => {
    return () => {
      window.location.href = pageUrl;
    };
  };

  const renderItem = (item: GuideItem) => {
    if (item.type === 'title') {
      return (
        <div key={item.id} className={s.sectionTitle}>
          {item.title}
        </div>
      );
    }
    
    if (item.type === 'status') {
      return (
        <div key={item.id} className={s.statusContainer}>
          <StatusItem text={item.text!} isOk={item.isOk!} />
          {item.showButton && item.pageUrl && (
            <span 
              onClick={handleGoUrl(item.pageUrl)} 
              className={s.goButton}
            >
              {item.buttonText || '去设置'}
            </span>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`${s.courseGuideCard} ${className}`}>
      <span className={s.title}>{title}</span>
      <div className={s.statusContainerStyle}>
        {items.map(renderItem)}
      </div>
      {showMainButton && (
        <div className={s.buttonContainer}>
          <Button 
            type="primary" 
            className={s.button}
            onClick={onMainButtonClick}
          >
            {mainButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseGuideCard;