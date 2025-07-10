// CourseAbilityRelation.tsx
import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Radio, Button, Select, Collapse, notification, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// 关系类型定义
type RelationType = 'L' | 'M' | 'H' | '';

// 定义课程接口
interface Course {
  id: string;
  name: string;
  semester: number; // 1-8学期
  relations: CourseAbilityRelation[];
}

// 定义课程和毕业能力之间的关系
interface CourseAbilityRelation {
  abilityId: string;
  relation: RelationType;
}

// 毕业能力要求接口
interface GraduationAbility {
  id: string;
  ability: string;
  description: string;
  subAbilities: SubAbility[];
}

// 子能力接口
interface SubAbility {
  name: string;
}

// 组件属性接口
interface CourseAbilityRelationProps {
  graduationAbilities: GraduationAbility[];
  courses: Course[];
  onSave?: (updatedCourses: Course[]) => void;
}

// 表格单元格数据的键值类型
type CellKey = {
  courseId: string;
  abilityId: string;
};

// 关系级别对应的颜色
const relationColors = {
  L: '#52c41a', // 绿色
  M: '#faad14', // 黄色
  H: '#ff4d4f',  // 红色
  '': '#d9d9d9'  // 默认灰色
};

const CourseAbilityRelation: React.FC<CourseAbilityRelationProps> = ({ 
  graduationAbilities, 
  courses = [],
  onSave
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [courseRelations, setCourseRelations] = useState<Map<string, RelationType>>(new Map());
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  
  // 初始化关系映射
  useEffect(() => {
    const relationMap = new Map<string, RelationType>();
    courses.forEach(course => {
      course.relations.forEach(relation => {
        const key = `${course.id}-${relation.abilityId}`;
        relationMap.set(key, relation.relation);
      });
    });
    setCourseRelations(relationMap);
  }, [courses]);
  
  // 获取单元格关系值
  const getCellRelation = (courseId: string, abilityId: string): RelationType => {
    const key = `${courseId}-${abilityId}`;
    return courseRelations.get(key) || '';
  };
  
  // 设置单元格关系值
  const setCellRelation = (courseId: string, abilityId: string, relation: RelationType) => {
    const key = `${courseId}-${abilityId}`;
    const newRelations = new Map(courseRelations);
    
    if (relation === '') {
      newRelations.delete(key);
    } else {
      newRelations.set(key, relation);
    }
    
    setCourseRelations(newRelations);
    setUnsavedChanges(true);
  };
  
  // 保存更改
  const handleSave = () => {
    const updatedCourses = courses.map(course => {
      const courseRelationsList: CourseAbilityRelation[] = [];
      graduationAbilities.forEach(ability => {
        const relation = getCellRelation(course.id, ability.id);
        if (relation) {
          courseRelationsList.push({
            abilityId: ability.id,
            relation
          });
        }
      });
      
      return {
        ...course,
        relations: courseRelationsList
      };
    });
    
    if (onSave) {
      onSave(updatedCourses);
    }
    
    setUnsavedChanges(false);
    notification.success({
      message: '保存成功',
      description: '课程与毕业能力要求相关性数据已更新'
    });
  };
  
  // 筛选课程数据
  const filteredCourses = selectedSemester === 'all' 
    ? [...courses].sort((a, b) => a.semester - b.semester)
    : courses.filter(course => course.semester === selectedSemester);
  
  // 关系选择器组件
  const RelationSelector: React.FC<{
    courseId: string;
    abilityId: string;
    value: RelationType;
    onChange: (value: RelationType) => void;
  }> = ({ courseId, abilityId, value, onChange }) => (
    <div className="relation-selector">
      <Radio.Group 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="relation-radio-group"
      >
        <Radio.Button value="L" className={`relation-radio-button relation-radio-L`}>L</Radio.Button>
        <Radio.Button value="M" className={`relation-radio-button relation-radio-M`}>M</Radio.Button>
        <Radio.Button value="H" className={`relation-radio-button relation-radio-H`}>H</Radio.Button>
        {value && (
          <Radio.Button value="" className="relation-radio-button">
            清除
          </Radio.Button>
        )}
      </Radio.Group>
    </div>
  );
  
  // 构建表格列配置
  const columns: ColumnsType<Course> = [
    {
      title: '学期',
      dataIndex: 'semester',
      key: 'semester',
      width: 80,
      align: 'center',
      fixed: 'left',
      className: 'course-header-column',
      render: (semester: number) => (
        <div className="course-cell">
          <Text strong>{`第${semester}学期`}</Text>
        </div>
      ),
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'left',
      fixed: 'left',
      className: 'course-header-column',
      render: (name: string) => (
        <div className="course-cell">
          <Text strong>{name}</Text>
        </div>
      ),
    },
    ...graduationAbilities.map((ability) => ({
      title: (
        <div className="ability-header">
          <Text strong>{ability.ability}</Text>
          <Paragraph type="secondary" style={{ fontSize: '12px', marginBottom: 0 }}>
            {ability.description}
          </Paragraph>
        </div>
      ),
      dataIndex: ability.id,
      key: ability.id,
      width: 100,
      align: 'center' as const,
      className: 'relation-data-column',
      render: (_: any, record: Course) => {
        const relation = getCellRelation(record.id, ability.id);
        return (
          <RelationSelector
            courseId={record.id}
            abilityId={ability.id}
            value={relation}
            onChange={(value) => setCellRelation(record.id, ability.id, value)}
          />
        );
      },
    })),
  ];
  
  // 按学期分组展示
  const renderCoursesByGroups = () => {
    // 获取所有出现的学期
    const semesters = Array.from(new Set(courses.map(course => course.semester))).sort();
    
    return (
      <Collapse 
        defaultActiveKey={semesters.length > 0 ? [semesters[0].toString()] : []}
        className="course-relation-collapse"
      >
        {semesters.map(semester => {
          const semesterCourses = courses.filter(course => course.semester === semester);
          
          return (
            <Panel header={`第${semester}学期课程 (${semesterCourses.length}门)`} key={semester.toString()}>
              <Table
                columns={columns.filter(col => !('dataIndex' in col) || col.dataIndex !== 'semester')} // 移除学期列，因为已经在Panel标题中显示
                dataSource={semesterCourses}
                pagination={false}
                bordered
                rowKey="id"
                size="middle"
                scroll={{ x: 800 }}
                className="course-relation-table"
              />
            </Panel>
          );
        })}
      </Collapse>
    );
  };

  // 如果没有毕业能力要求数据，显示提示信息
  if (graduationAbilities.length === 0) {
    return (
      <Card title="课程与毕业能力要求相关性列表" bordered={false}>
        <Empty description="请先在上方填写并保存毕业能力要求" />
      </Card>
    );
  }

  // 如果没有课程数据，显示提示信息
  if (courses.length === 0) {
    return (
      <Card title="课程与毕业能力要求相关性列表" bordered={false}>
        <Empty description="暂无课程数据，请先添加课程" />
      </Card>
    );
  }

  return (
    <div className="course-relation-container">
      <Card 
        title={<Title level={4}>课程与毕业能力要求相关性列表</Title>} 
        bordered={false}
        className="course-relation-card"
      >
        <div className="course-relation-header">
          <Paragraph className="help-text">
            请为每门课程选择与各毕业能力要求的相关性程度，L表示低度相关，M表示中度相关，H表示高度相关。
          </Paragraph>
        </div>
        
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <Text>按学期筛选：</Text>
          <Select 
            value={selectedSemester} 
            onChange={setSelectedSemester} 
            style={{ width: 120, marginLeft: 8 }}
          >
            <Option value="all">全部学期</Option>
            {Array.from({ length:8 }, (_, i) => i + 1).map(semester => (
              <Option key={semester} value={semester}>第{semester}学期</Option>
            ))}
          </Select>
        </div>
        
        <div className="course-relation-table-wrapper">
          {selectedSemester === 'all' ? (
            // 分组展示模式
            renderCoursesByGroups()
          ) : (
            // 平铺表格模式
            <Table
              columns={columns}
              dataSource={filteredCourses}
              pagination={false}
              bordered
              rowKey="id"
              size="middle"
              scroll={{ x: 800 }}
              className="course-relation-table"
            />
          )}
        </div>
        
        <div className="course-relation-actions">
          <Button 
            type="primary" 
            onClick={handleSave} 
            disabled={!unsavedChanges}
          >
            保存更改
          </Button>
        </div>
        
        <div className="relation-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: relationColors.L }}></div>
            <Text>L - 低度相关</Text>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: relationColors.M }}></div>
            <Text>M - 中度相关</Text>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: relationColors.H }}></div>
            <Text>H - 高度相关</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CourseAbilityRelation;