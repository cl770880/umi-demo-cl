import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import './index.scss'; // 直接导入CSS文件

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
}

interface ClassroomCardProps {
  classroom: ClassroomData;
  showClassroomCount?: boolean;
  description?: string;
  customCardStyle?: object;
  hiddenCertTag?: boolean;
  onClick?: (classroom: ClassroomData) => void;
}

class MoocClassroomCard extends Component<ClassroomCardProps> {
  constructor(props: ClassroomCardProps) {
    super(props);
  }
  
  static propTypes = {
    classroom: PropTypes.object.isRequired,
    showClassroomCount: PropTypes.bool,
    description: PropTypes.string,
    customCardStyle: PropTypes.object,
    hiddenCertTag: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    showClassroomCount: true,
    hiddenCertTag: false,
  };

  goToDetail = () => {
    const { classroom, onClick } = this.props;
    
    if (onClick) {
      onClick(classroom);
    } else {
      // 默认跳转逻辑，可以根据实际需求修改
      const { teachCaseLink, classroomId } = classroom;
      const detailUrl = teachCaseLink || `/classroom/${classroomId}`;
      window.open(detailUrl);
    }
  };

  render() {
    const { classroom, description, customCardStyle, hiddenCertTag, showClassroomCount } = this.props;
    
    if (!classroom) {
      return null;
    }

    const {
      coverPhoto,
      courseName,
      courseLectorName,
      schoolName,
      classroomCount = 1,
      participantCount,
      termProgress,
      termEndTime,
      currentTermId,
    } = classroom;

    // 使用普通 className 字符串，确保与 CSS 中的类名一致
    const nameClass = classNames({
      'mooc-name': true,
      'mooc-name-hide': true,
    });

    const classroomCardClass = classNames({
      'mooc-classroom-card': true,
      'mooc-classroom-card-x': description,
    });

    // 判断课堂状态标识
    const isActive = moment().isBefore(moment(termEndTime)) && currentTermId;
    const showCertTag = isActive && !hiddenCertTag;

    return (
      <div
        className='mooc-classroom-card'
        onClick={this.goToDetail}
        style={customCardStyle}
      >
        {/* 课堂封面 */}
        <div
          className="mooc-cover"
          style={{
            height: 126,
            background: `url(${coverPhoto}) no-repeat`,
            backgroundSize: 'cover',
            backgroundPosition: '0 50%',
          }}
        >
        </div>

        <div className="mooc-content">
          <div className="mooc-base-info">
            {/* 关联课程名称 */}
            <h3 className={nameClass} title={courseName}>
              {courseName}
            </h3>

            {/* 学校名称 */}
            <p className="mooc-school">{schoolName}</p>

            {showClassroomCount && classroomCount > 1 && (
                <span className={classNames("mooc-count", { "mooc-count-fl": description })}>
                  {classroomCount}个课堂
                </span>
              )}

          
          </div>

          <div className="mooc-ft">
            {/* 课堂数量/参与人数 */}
            <div className="mooc-classroom-stats">
                {/* 课程老师 */}
            {!description && courseLectorName && (
              <div className="mooc-teachers">{courseLectorName}</div>
            )}
              {participantCount && (
                <span className={classNames("mooc-count", { "mooc-count-fl": description })}>
                  {participantCount}人参加
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default MoocClassroomCard;