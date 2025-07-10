/* eslint-disable complexity */
/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';

// 样式对象
const styles = {
  classroomCard: {
    width: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  classroomCardHover: {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
  classroomCardX: {
    display: 'flex',
  },
  cover: {
    width: '100%',
  },
  coverX: {
    width: '30%',
    height: '100%',
    flexShrink: 0,
  },
  content: {
    padding: '12px',
  },
  contentX: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  baseInfo: {
    marginBottom: '8px',
  },
  name: {
    margin: '0 0 8px',
    fontSize: '16px',
    color: '#333',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  termTime: {
    fontSize: '12px',
    color: '#999',
  },
  description: {
    fontSize: '12px',
    color: '#666',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
};

class ClassroomCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  goToDetail = () => {
    const {
      classroom: { detailUrl },
    } = this.props;

    window.open(detailUrl);
  };

  // 格式化日期，使用原生 JavaScript 代替 moment
  formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '';
    }
  };

  // 格式化学期时间显示
  formatTermTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    const start = this.formatDate(startTime);
    const end = this.formatDate(endTime);
    
    if (!start || !end) return '';
    
    return `${start}至${end}`;
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { classroom, description, customCardStyle } = this.props;
    const { isHovered } = this.state;

    if (!classroom) {
      return null;
    }

    const {
      cover,
      originalSizeCover,
      classroomName,
      courseName,
      termStartTime,
      termEndTime,
    } = classroom;

    // 组合显示的课堂标题：课堂名称-课程名称
    const displayTitle = classroomName && courseName 
      ? `${classroomName}-${courseName}`
      : classroomName || courseName || '未命名课堂';
    
    // 学期时间显示
    const termTimeText = this.formatTermTime(termStartTime, termEndTime);

    // 根据是否有描述来决定卡片样式
    const hasDescription = !!description;

    // 动态计算样式
    const cardStyle = {
      ...styles.classroomCard,
      ...(hasDescription ? styles.classroomCardX : {}),
      ...(isHovered ? styles.classroomCardHover : {}),
      ...customCardStyle,
    };

    const coverStyle = {
      ...(hasDescription ? styles.coverX : styles.cover),
      height: hasDescription ? 'auto' : 126,
      background: `url(${originalSizeCover || cover || ''}) no-repeat`,
      backgroundSize: 'cover',
      backgroundPosition: '0 50%',
    };

    const contentStyle = {
      ...styles.content,
      ...(hasDescription ? styles.contentX : {}),
    };

    return (
      <div
        style={cardStyle}
        onClick={this.goToDetail}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {/* 封面图片 */}
        <div
          alt="课堂封面"
          style={coverStyle}
        />

        {/* 内容区域 */}
        <div style={contentStyle}>
          <div style={styles.baseInfo}>
            {/* 课堂标题：课堂名称-课程名称 */}
            <h3 style={styles.name} title={displayTitle}>
              {displayTitle}
            </h3>

            {/* 学期时间 */}
            {termTimeText && (
              <div style={styles.termTime}>
                学期时间 {termTimeText}
              </div>
            )}
          </div>

          {/* 描述信息 */}
          {description && <div style={styles.description}>{description}</div>}
        </div>
      </div>
    );
  }
}

export default ClassroomCard;