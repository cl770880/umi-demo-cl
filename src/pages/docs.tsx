import React, { useState, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Input, 
  message, 
  Tag, 
  Space, 
  Popconfirm,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  UserAddOutlined, 
  DeleteOutlined,
  QuestionCircleOutlined 
} from '@ant-design/icons';
import { Link } from 'umi';
import './docs.css';

// 老师信息接口
interface Teacher {
  id: string;
  name: string;
  department: string;
  title: string;
}

// 专业信息接口
interface Specialty {
  key: string;
  name: string;
  teachers: Teacher[]; // 负责老师列表
}

const SpecialtyManagement: React.FC = () => {
  // 模拟老师数据库
  const [allTeachers] = useState<Teacher[]>([
    { id: '1', name: '张三', department: '计算机学院', title: '教授' },
    { id: '2', name: '李四', department: '计算机学院', title: '副教授' },
    { id: '3', name: '王五', department: '电气学院', title: '讲师' },
    { id: '4', name: '赵六', department: '计算机学院', title: '教授' },
    { id: '5', name: '刘七', department: '电气学院', title: '副教授' },
  ]);

  // 专业列表状态
  const [specialties, setSpecialties] = useState<Specialty[]>([
    { 
      key: '1', 
      name: '软件工程',
      teachers: [
        { id: '1', name: '张三', department: '计算机学院', title: '教授' },
        { id: '2', name: '李四', department: '计算机学院', title: '副教授' }
      ]
    },
    { 
      key: '2', 
      name: '电气工程',
      teachers: [
        { id: '3', name: '王五', department: '电气学院', title: '讲师' }
      ]
    },
  ]);

  // 弹窗状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTeacherModalVisible, setIsTeacherModalVisible] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState('');
  const [currentSpecialtyKey, setCurrentSpecialtyKey] = useState<string>('');
  
  // 老师选择相关状态
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [teacherSearchValue, setTeacherSearchValue] = useState('');

  // 添加专业负责老师
  const showTeacherModal = (specialtyKey: string) => {
    setCurrentSpecialtyKey(specialtyKey);
    setSelectedTeachers([]);
    setTeacherSearchValue('');
    setIsTeacherModalVisible(true);
  };

  // 删除专业负责老师 - 带确认
  const confirmRemoveTeacher = useCallback((specialtyKey: string, teacherId: string, teacherName: string) => {
    setSpecialties(prev => prev.map(specialty => 
      specialty.key === specialtyKey 
        ? {
            ...specialty,
            teachers: specialty.teachers.filter(teacher => teacher.id !== teacherId)
          }
        : specialty
    ));
    message.success(`已删除老师 "${teacherName}"`);
  }, []);

  // 删除专业 - 带确认
  const confirmDeleteSpecialty = useCallback((specialtyKey: string, specialtyName: string) => {
    setSpecialties(prev => prev.filter(specialty => specialty.key !== specialtyKey));
    message.success(`已删除专业 "${specialtyName}"`);
  }, []);

  // 过滤可选老师（排除已添加的）
  const getAvailableTeachers = useCallback(() => {
    const currentSpecialty = specialties.find(s => s.key === currentSpecialtyKey);
    const existingTeacherIds = currentSpecialty?.teachers.map(t => t.id) || [];
    
    return allTeachers.filter(teacher => 
      !existingTeacherIds.includes(teacher.id) &&
      (teacherSearchValue === '' || 
       teacher.name.toLowerCase().includes(teacherSearchValue.toLowerCase()) ||
       teacher.department.toLowerCase().includes(teacherSearchValue.toLowerCase()))
    );
  }, [allTeachers, specialties, currentSpecialtyKey, teacherSearchValue]);

  // 添加选中的老师
  const addSelectedTeacher = (teacher: Teacher) => {
    if (!selectedTeachers.find(t => t.id === teacher.id)) {
      setSelectedTeachers(prev => [...prev, teacher]);
    }
  };

  // 移除选中的老师
  const removeSelectedTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  // 确认添加老师
  const handleTeacherOk = () => {
    if (selectedTeachers.length === 0) {
      message.warning('请至少选择一位老师');
      return;
    }

    setSpecialties(prev => prev.map(specialty => 
      specialty.key === currentSpecialtyKey 
        ? {
            ...specialty,
            teachers: [...specialty.teachers, ...selectedTeachers]
          }
        : specialty
    ));

    setIsTeacherModalVisible(false);
    setSelectedTeachers([]);
    message.success(`成功添加 ${selectedTeachers.length} 位老师`);
  };

  // 渲染负责老师列 - 添加删除确认
  const renderTeachersColumn = (teachers: Teacher[], specialtyKey: string) => {
    return (
      <div className="teachers-column">
        <div className="teachers-list">
          {teachers.map(teacher => (
            <Popconfirm
              key={teacher.id}
              title={`确认删除老师 "${teacher.name}" 吗？`}
              description="删除后将无法恢复，请谨慎操作。"
              onConfirm={() => confirmRemoveTeacher(specialtyKey, teacher.id, teacher.name)}
              okText="确认删除"
              cancelText="取消"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              okType="danger"
            >
              <Tag 
                closable
                className="teacher-tag"
                closeIcon={<DeleteOutlined className="delete-icon" />}
              >
                {teacher.name}
              </Tag>
            </Popconfirm>
          ))}
        </div>
        <Button
          type="dashed"
          size="small"
          icon={<UserAddOutlined />}
          onClick={() => showTeacherModal(specialtyKey)}
          className="add-teacher-btn"
        >
          添加老师
        </Button>
      </div>
    );
  };

  // 表格列配置 - 添加删除专业功能
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
    },
    {
      title: '专业',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '负责老师',
      key: 'teachers',
      width: 300,
      render: (_: any, record: Specialty) => 
        renderTeachersColumn(record.teachers, record.key),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Specialty) => (
        <Space className="action-links" split={<Divider type="vertical" />}>
          <a href="#">查看站点</a>
          <Link to='/home'>编辑信息</Link>
          <Popconfirm
            title={`确认删除专业 "${record.name}" 吗？`}
            description={
              <div>
                <div>删除后将无法恢复，请谨慎操作。</div>
                {record.teachers.length > 0 && (
                  <div style={{ color: '#ff4d4f', marginTop: 4 }}>
                    注意：该专业下还有 {record.teachers.length} 位负责老师
                  </div>
                )}
              </div>
            }
            onConfirm={() => confirmDeleteSpecialty(record.key, record.name)}
            okText="确认删除"
            cancelText="取消"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            okType="danger"
          >
            <a style={{ color: '#ff4d4f' }}>
              <DeleteOutlined /> 删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 新建专业
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (newSpecialtyName.length > 30) {
      message.error('专业名称不能超过30字符');
      return;
    }
    if (newSpecialtyName.trim() !== '') {
      const newSpecialty: Specialty = {
        key: (Math.max(...specialties.map(s => parseInt(s.key))) + 1).toString(),
        name: newSpecialtyName,
        teachers: [],
      };
      setSpecialties([...specialties, newSpecialty]);
      setIsModalVisible(false);
      setNewSpecialtyName('');
      message.success('新建专业成功');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewSpecialtyName('');
  };

  const handleTeacherCancel = () => {
    setIsTeacherModalVisible(false);
    setSelectedTeachers([]);
    setTeacherSearchValue('');
  };

  return (
    <div className="specialty-management">
      <div className="header">
        <h2>智慧专业门户</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          新建专业
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={specialties} 
        pagination={false}
        className="specialty-table"
      />

      {/* 新建专业弹窗 */}
      <Modal
        title="新建专业门户"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            保存
          </Button>,
        ]}
      >
        <div className="modal-content">
          <label>专业名称:</label>
          <Input
            value={newSpecialtyName}
            onChange={(e) => setNewSpecialtyName(e.target.value)}
            maxLength={30}
            placeholder="请输入专业名称"
          />
        </div>
      </Modal>

      {/* 选择专业门户管理老师弹窗 */}
      <Modal
        title="选择专业门户管理老师"
        open={isTeacherModalVisible}
        onOk={handleTeacherOk}
        onCancel={handleTeacherCancel}
        width={600}
        className="teacher-selection-modal"
        footer={[
          <Button key="cancel" onClick={handleTeacherCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleTeacherOk}>
            保存
          </Button>,
        ]}
      >
        <div className="teacher-modal-content">
          <div className="search-section">
            <label>老师姓名:</label>
            <Input
              value={teacherSearchValue}
              onChange={(e) => setTeacherSearchValue(e.target.value)}
              placeholder="请输入老师姓名"
              className="teacher-search-input"
            />
          </div>

          {/* 已选择的老师 */}
          {selectedTeachers.length > 0 && (
            <div className="selected-teachers-section">
              <div className="section-title">已选择老师：</div>
              <div className="selected-teachers">
                {selectedTeachers.map(teacher => (
                  <Tag
                    key={teacher.id}
                    closable
                    onClose={() => removeSelectedTeacher(teacher.id)}
                    color="green"
                    className="selected-teacher-tag"
                  >
                    {teacher.name} ({teacher.title})
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* 可选老师列表 */}
          <div className="available-teachers-section">
            <div className="section-title">可选老师：</div>
            <div className="available-teachers">
              {getAvailableTeachers().map(teacher => (
                <div 
                  key={teacher.id} 
                  className="teacher-item"
                  onClick={() => addSelectedTeacher(teacher)}
                >
                  <div className="teacher-info">
                    <span className="teacher-name">{teacher.name}</span>
                    <span className="teacher-details">
                      {teacher.department} · {teacher.title}
                    </span>
                  </div>
                  <Button 
                    type="link" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      addSelectedTeacher(teacher);
                    }}
                  >
                    选择
                  </Button>
                </div>
              ))}
              {getAvailableTeachers().length === 0 && (
                <div className="no-teachers-available">
                  {teacherSearchValue ? '未找到匹配的老师' : '暂无可选老师'}
                </div>
              )}
            </div>
          </div>

          <div className="modal-tips">
            <div className="tip-item">专业名称限30字以内；</div>
            <div className="tip-item">超过与否在输入框下方进行提示；</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpecialtyManagement;