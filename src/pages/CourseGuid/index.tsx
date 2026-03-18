import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Progress, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CourseGuideCard from './CourseGuideCard';
import { GuideItem } from './types';
import s from './index.css';

const { Option } = Select;

// 模拟学期数据
const termOptions = [
  { id: 1, name: 'C语言' },
  { id: 2, name: 'C语言（网易MOOC+SPOC学校（测试）- 建课老师01-2020-02-13至2020...' },
  { id: 3, name: 'C语言程序设计进阶（浙江大学-翁恺-2023-11-13至2024-01-31）' },
];

const CourseGuidePage: React.FC = () => {
  // 弹窗状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'selectTerm' | 'copying' | 'completed'>('selectTerm');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [copyProgress, setCopyProgress] = useState(0);
  const [copyTimer, setCopyTimer] = useState<NodeJS.Timeout | null>(null);
  const [modal, contextHolder] = Modal.useModal();

  // 资源状态模拟
  const hasHistoryTerm = true;
  const hasSourceData = true;

 // 第一张卡片数据
  const card1Data: GuideItem[] = [
    {
      id: '1',
      type: 'status',
      text: '课件',
      isOk: false,
      pageUrl: '/courseware',
      showButton: true,
      buttonText: '去录入'
    },
    {
      id: '2',
      type: 'status',
      text: '作业',
      isOk: true,
      pageUrl: '/homework',
      showButton: true,
      buttonText: '去录入'
    },
    {
      id: '3',
      type: 'status',
      text: '讨论',
      isOk: true,
      pageUrl: '/discussion',
      showButton: true,
      buttonText: '去录入'
    }
  ];

  // 第二张卡片数据
  const card2Data: GuideItem[] = [
    {
      id: '1',
      type: 'status',
      text: '数字教学课件',
      isOk: false,
      showButton: false
    },
    {
      id: '2',
      type: 'status',
      text: '课程图谱',
      pageUrl: '/course-map',
      isOk: true,
      showButton: true,
      buttonText: '去录入'
    },
    {
      id: '3',
      type: 'status',
      text: 'AI助教',
      isOk: true,
      showButton: false
    },
    {
      id: '4',
      type: 'title',
      title: '其他教学资源关联',
    },
    {
      id: '5',
      type: 'status',
      text: '线上学期',
      isOk: true,
      pageUrl: '/class-management',
      showButton: false,
    },
    {
      id: '6',
      type: 'status',
      text: '数字教材',
      isOk: true,
      showButton: false,
    },
    
  ];

  // 第三张卡片数据
  const card3Data: GuideItem[] = [
    {
      id: '1',
      type: 'status',
      text: '班级管理和学生导入',
      isOk: false,
      pageUrl: '/class-management',
      showButton: true,
      buttonText: '去设置'
    },
    {
      id: '2',
      type: 'status',
      text: '班级评分设置',
      isOk: true,
      pageUrl: '/grade-settings',
      showButton: true,
      buttonText: '去设置'
    }
  ];


  // 处理课堂上课点击
  const handleClassroomClick = () => {
    console.log('触发“课堂上课”逻辑');
  };

  // 打开复制资源模态框
  const openCopyResourceModal = () => {
    setIsModalOpen(true);
    setCurrentStep('selectTerm');
    setSelectedTerm('');
    setCopyProgress(0);
  };

  // 关闭模态框
  const handleCancel = () => {

      resetModalState();
    
  };

  // 重置模态框状态
  const resetModalState = () => {
    setIsModalOpen(false);
    setCurrentStep('selectTerm');
    setSelectedTerm('');
    setCopyProgress(0);
    if (copyTimer) {
      clearInterval(copyTimer);
      setCopyTimer(null);
    }
  };

  // 开始复制过程
  const startCopy = () => {
    if (!selectedTerm) {
      message.warning('请选择学期');
      return;
    }
    
    setCurrentStep('copying');
    setCopyProgress(0);
    
    // 模拟复制进度
    const timer = setInterval(() => {
      setCopyProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(timer);
          setCopyTimer(null);
          setCurrentStep('completed');
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    setCopyTimer(timer);
  };
  const handleInterruptCopy = () => {
    modal.confirm({
      title: '确认中断复制',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: confirmInterrupt,
    })

  }

  // 确认中断复制
  const confirmInterrupt = () => {
    if (copyTimer) {
      clearInterval(copyTimer);
      setCopyTimer(null);
    }
    resetModalState();
    message.info('已中断复制');
  };

  // 渲染不同状态的弹窗内容
  const renderModalContent = () => {
    switch (currentStep) {
      case 'selectTerm':
        return (
          <div className={s.modalContent}>
            <div className={s.formItem}>
              <span className={s.label}>学期选择</span>
              <Select
                placeholder="请选择学期"
                style={{ width: '100%' }}
                value={selectedTerm}
                onChange={setSelectedTerm}
                showSearch
                optionFilterProp="children"
                notFoundContent="暂无数据"
              >
                {termOptions.map(term => (
                  <Option key={term.id} value={term.id.toString()}>
                    {term.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        );

      case 'copying':
        return (
          <div className={s.modalContent}>
            <div className={s.progressContainer}>
              <span className={s.progressText}>学期章节复制中</span>
              <Progress 
                percent={copyProgress} 
                strokeColor="#00CC7E" 
                status="active" 
              />
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className={s.modalContent}>
            <div className={s.progressContainer}>
              <span className={s.progressText}>学期章节复制完毕</span>
              <Progress 
                percent={100} 
                strokeColor="#00CC7E" 
                status="success" 
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 渲染不同状态的按钮
  const renderModalButtons = () => {
    switch (currentStep) {
      case 'selectTerm':
        return (
          <>
            <Button onClick={handleCancel} className={s.cancelButton}>取消</Button>
            <Button type="primary" onClick={startCopy} className={s.confirmButton}>保存</Button>
          </>
        );

      case 'copying':
        return (
          <Button 
            type="primary" 
            onClick={handleInterruptCopy} 
            className={s.confirmButton}
          >
            中止复制
          </Button>
        );

      case 'completed':
        return (
          <Button 
            type="primary" 
            onClick={resetModalState} 
            className={s.confirmButton}
          >
            知道了
          </Button>
        );

      default:
        return null;
    }
  };

  // 快速复制课程资源组件
  const FastCopyCourseResource = () => {
    if (!hasSourceData && !hasHistoryTerm) {
      return null;
    }
    return (
      <div className={s.quickCopyHear}>
        <div className={s.quickCopyTitle}>快速复制课程资源</div>
        <p className={s.quickCopyDesc}>
          你可以从历史学期内容，或者其他公共课程中选择复制导入课程资源，来快速设置课程内容
        </p>
        <div className={s.buttonGroup}>
          {hasSourceData && (
            <Button 
              type="primary" 
              className={s.copyResourceButton} 
            >
              从教学资源库导入
            </Button>
          )}
          {hasHistoryTerm && (
            <Button style={{ height: 40, borderRadius: 6 }} onClick={openCopyResourceModal}>
              导入慕课堂资源
            </Button>
          )}
        </div>
      </div>
    );
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (copyTimer) {
        clearInterval(copyTimer);
      }
    };
  }, [copyTimer]);

  return (
    <div className={s.courseGuidePage}>
      {FastCopyCourseResource()}

      <div className={s.guideTitle}>开课引导</div>

      <div className={s.guideCardContainer}>
        {/* 卡片1：课程教学资源准备 */}
        <CourseGuideCard
          title="1. 课程教学资源准备"
          items={card1Data}
        />

        {/* 卡片2：新形态教学内容服务制作 */}
        <CourseGuideCard
          title="2. 新形态教学内容服务制作"
          items={card2Data}
        />

        {/* 卡片3：班级学生管理和班级设置（含底部按钮） */}
       <CourseGuideCard
        title="3.班级学生管理和班级设置"
        items={card3Data}
        showMainButton={true}
        mainButtonText="课堂上课"
        onMainButtonClick={handleClassroomClick}
      />
      </div>

      {/* 主复制弹窗 */}
      <Modal
        title="选择校级资源库学期章节目录复制"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={renderModalButtons()}
        width={600}
        maskClosable={false}
      >
        <p className={s.modalDescription}>
          确认复制后，将选择的源学期章节目录中的学习内容(不包含考核)复制到当前章节中
        </p>
        {renderModalContent()}
      </Modal>
    {contextHolder}


    </div>
  );
};

export default CourseGuidePage;
