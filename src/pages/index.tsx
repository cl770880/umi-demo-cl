import React, { useState, useMemo } from 'react';
import { Layout, Card, Button, Tag, message, Modal, Input, Form, Table } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './Component1.module.css';

const { Content } = Layout;
const { TextArea } = Input;

const ContentPage: React.FC = () => {
  // 修改后的专业数据（3个培养目标，8个毕业能力，8门课程）
  const mockMajorData = {
    "members": null,
    "id": 1029,
    "schoolId": 2001,
    "name": "土木工程",
    "description": null,
    "backgroundImgUrl": null,
    "courseBindingJsonList": null,
    "cultivationTarget": {
        "introduction": "本专业旨在培养德智体美劳全面发展，具有社会主义核心价值观，掌握土木工程学科的基本理论、基本知识和基本技能，获得工程师基本训练，具备从事土木工程的项目规划、设计、研究开发、施工及管理的能力，能在房屋建筑、地下建筑、道路、隧道、桥梁建筑等的设计、研究、施工、教育、管理、投资、开发部门胜任技术或管理工作的高级工程技术人才。",
        "targetList": [
            {
                "targetNo": 1,
                "targetName": "知识目标",
                "targetDescription": "掌握土木工程专业相关的数学、自然科学、工程基础和专业知识，能够运用相关知识分析和解决复杂土木工程问题。具备扎实的理论基础，包括工程力学、结构力学、材料力学、土力学等核心专业知识。"
            },
            {
                "targetNo": 2,
                "targetName": "能力目标", 
                "targetDescription": "具备土木工程设计、施工、管理和研究能力，能够设计针对复杂工程问题的解决方案，具有创新意识和工程实践能力。能够运用现代工程工具，具备项目管理和团队协作能力。"
            },
            {
                "targetNo": 3,
                "targetName": "素质目标",
                "targetDescription": "具有良好的人文社会科学素养、职业道德和社会责任感，具备国际视野和跨文化交流能力。具有终身学习意识和可持续发展理念，能够适应社会发展需要。"
            }
        ]
    },
    "abilityList": [
        {
            "abilityNo": 1,
            "abilityName": "工程知识",
            "abilityDescription": "能够将数学、自然科学、工程基础和土木工程专业知识用于解决复杂土木工程问题。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "掌握数学、物理、化学等自然科学基础知识。"
                },
                {
                    "subAbilityNo": "2", 
                    "subAbilityDescription": "掌握工程力学、结构力学、材料力学等工程基础知识。"
                },
                {
                    "subAbilityNo": "3",
                    "subAbilityDescription": "掌握土木工程材料、土力学、基础工程等专业知识。"
                },
                {
                    "subAbilityNo": "4",
                    "subAbilityDescription": "能够运用所学知识分析和解决复杂土木工程问题。"
                }
            ]
        },
        {
            "abilityNo": 2,
            "abilityName": "问题分析",
            "abilityDescription": "能够应用数学、自然科学和工程科学的基本原理，识别、表达、并通过文献研究分析复杂土木工程问题，以获得有效结论。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "能够运用科学原理识别和判断复杂土木工程问题的关键环节。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "能够正确表达复杂土木工程问题。"
                },
                {
                    "subAbilityNo": "3",
                    "subAbilityDescription": "能够通过文献研究寻求可替代的解决方案。"
                }
            ]
        },
        {
            "abilityNo": 3,
            "abilityName": "设计/开发解决方案",
            "abilityDescription": "能够设计针对复杂土木工程问题的解决方案，设计满足特定需求的土木工程系统、结构或施工工艺，并能够在设计环节中体现创新意识。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "能够设计满足特定需求的土木工程结构或系统。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "在设计过程中能够考虑安全、环保、法律等制约因素。"
                }
            ]
        },
        {
            "abilityNo": 4,
            "abilityName": "研究",
            "abilityDescription": "能够基于科学原理并采用科学方法对复杂土木工程问题进行研究，包括设计实验、分析与解释数据、并通过信息综合得到合理有效的结论。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "能够基于科学原理，通过文献研究或相关方法，调研和分析复杂土木工程问题的解决方案。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "能够设计针对复杂土木工程问题的实验方案。"
                }
            ]
        },
        {
            "abilityNo": 5,
            "abilityName": "使用现代工具",
            "abilityDescription": "能够针对复杂土木工程问题，开发、选择与使用恰当的技术、资源、现代工程工具和信息技术工具。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "能够选择与使用恰当的技术、资源、现代工程工具和信息技术工具。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "能够理解各种技术工具的适用场景和局限性。"
                }
            ]
        },
        {
            "abilityNo": 6,
            "abilityName": "工程与社会",
            "abilityDescription": "能够基于土木工程相关背景知识进行合理分析，评价土木工程实践和复杂工程问题解决方案对社会、健康、安全、法律以及文化的影响。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "了解土木工程实践对社会、健康、安全、法律以及文化的影响。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "理解土木工程师应承担的责任。"
                }
            ]
        },
        {
            "abilityNo": 7,
            "abilityName": "环境和可持续发展",
            "abilityDescription": "能够理解和评价针对复杂土木工程问题的工程实践对环境、社会可持续发展的影响。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "知晓和理解环境保护和可持续发展的理念和内涵。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "能够站在环境保护和可持续发展的角度思考土木工程实践的可持续性。"
                }
            ]
        },
        {
            "abilityNo": 8,
            "abilityName": "职业规范",
            "abilityDescription": "具有人文社会科学素养、社会责任感，能够在土木工程实践中理解并遵守工程职业道德和规范，履行责任。",
            "subAbilityList": [
                {
                    "subAbilityNo": "1",
                    "subAbilityDescription": "有正确价值观，理解个人与社会的关系，了解中国国情。"
                },
                {
                    "subAbilityNo": "2",
                    "subAbilityDescription": "能够在工程实践中理解并遵守工程职业道德和规范，履行责任。"
                }
            ]
        }
    ],
    "cultivationTargetAbilityRel": [
        // 培养目标1的关联关系
        { "targetNo": "1", "abilityNo": "1", "relType": "H" },
        { "targetNo": "1", "abilityNo": "2", "relType": "H" },
        { "targetNo": "1", "abilityNo": "4", "relType": "M"},
        // 培养目标2的关联关系
        { "targetNo": "2", "abilityNo": "3", "relType": "H" },
        { "targetNo": "2", "abilityNo": "4", "relType": "H" },
        { "targetNo": "2", "abilityNo": "5", "relType": "H" },
        // 培养目标3的关联关系
        { "targetNo": "3", "abilityNo": "6", "relType": "H" },
        { "targetNo": "3", "abilityNo": "7", "relType": "H" },
        { "targetNo": "3", "abilityNo": "8", "relType": "H" }
    ],
    "abilityCourseRel": [
        // 高等数学课程关联
        { "courseId": 1, "courseName": "高等数学", "abilityNo": "1-1", "relType": "H" },
        { "courseId": 1, "courseName": "高等数学", "abilityNo": "1-2", "relType": "M" },
        { "courseId": 1, "courseName": "高等数学", "abilityNo": "2-1", "relType": "M" },
        // 大学物理课程关联
        { "courseId": 2, "courseName": "大学物理", "abilityNo": "1-1", "relType": "M" },
        { "courseId": 2, "courseName": "大学物理", "abilityNo": "4-1", "relType": "H" },
        { "courseId": 2, "courseName": "大学物理", "abilityNo": "4-2", "relType": "M" },
        // 理论力学课程关联
        { "courseId": 3, "courseName": "理论力学", "abilityNo": "1-2", "relType": "H" },
        { "courseId": 3, "courseName": "理论力学", "abilityNo": "1-4", "relType": "H" },
        { "courseId": 3, "courseName": "理论力学", "abilityNo": "2-1", "relType": "M" },
        // 材料力学课程关联
        { "courseId": 4, "courseName": "材料力学", "abilityNo": "1-2", "relType": "H" },
        { "courseId": 4, "courseName": "材料力学", "abilityNo": "2-2", "relType": "H" },
        { "courseId": 4, "courseName": "材料力学", "abilityNo": "3-1", "relType": "M" },
        // 结构力学课程关联
        { "courseId": 5, "courseName": "结构力学", "abilityNo": "1-2", "relType": "H" },
        { "courseId": 5, "courseName": "结构力学", "abilityNo": "2-2", "relType": "H" },
        { "courseId": 5, "courseName": "结构力学", "abilityNo": "3-1", "relType": "H" },
        // 土力学课程关联
        { "courseId": 6, "courseName": "土力学", "abilityNo": "1-3", "relType": "H" },
        { "courseId": 6, "courseName": "土力学", "abilityNo": "2-1", "relType": "M" },
        { "courseId": 6, "courseName": "土力学", "abilityNo": "4-1", "relType": "M" },
        // 混凝土结构设计课程关联
        { "courseId": 7, "courseName": "混凝土结构设计", "abilityNo": "3-1", "relType": "H" },
        { "courseId": 7, "courseName": "混凝土结构设计", "abilityNo": "3-2", "relType": "H" },
        { "courseId": 7, "courseName": "混凝土结构设计", "abilityNo": "5-1", "relType": "M" },
        // 工程项目管理课程关联
        { "courseId": 8, "courseName": "工程项目管理", "abilityNo": "6-1", "relType": "H" },
        { "courseId": 8, "courseName": "工程项目管理", "abilityNo": "6-2", "relType": "M" },
        { "courseId": 8, "courseName": "工程项目管理", "abilityNo": "8-2", "relType": "H" }
    ]
  };

  // 毕业要求组件所需的状态
  const [selectedRequirement, setSelectedRequirement] = useState('1');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 根据后端数据生成毕业要求菜单项
  const requirementItems = useMemo(() => {
    return mockMajorData.abilityList.map(ability => ({
      id: ability.abilityNo.toString(),
      name: ability.abilityName
    }));
  }, []);

  // 根据后端数据生成内容映射
  const [contentMap, setContentMap] = useState(() => {
    const newContentMap: Record<string, { description: string; details: string[] }> = {};
    
    mockMajorData.abilityList.forEach(ability => {
      const details = ability.subAbilityList.map(sub => 
        `${ability.abilityNo}.${sub.subAbilityNo} ${sub.subAbilityDescription}`
      );
      
      newContentMap[ability.abilityNo.toString()] = {
        description: ability.abilityDescription,
        details: details
      };
    });
    
    return newContentMap;
  });

  const handleRequirementClick = (id: string) => {
    setSelectedRequirement(id);
  };

  // 获取当前选中项的内容
  const currentContent = contentMap[selectedRequirement] || Object.values(contentMap)[0];

  // 生成毕业要求与培养目标矩阵数据
  const matrixData = useMemo(() => {
    return mockMajorData.abilityList.map(ability => {
      const rowData: any = {
        key: ability.abilityNo.toString(),
        id: ability.abilityNo.toString(),
        name: ability.abilityName
      };

      // 为每个培养目标添加关联关系
      mockMajorData.cultivationTarget.targetList.forEach(target => {
        const relation = mockMajorData.cultivationTargetAbilityRel.find(
          rel => rel.targetNo === target.targetNo.toString() && 
                 rel.abilityNo === ability.abilityNo.toString()
        );
        
        rowData[`goal${target.targetNo}`] = !!relation;
      });

      return rowData;
    });
  }, []);

  // 生成课程体系与毕业要求矩阵数据
  const courseMatrixData = useMemo(() => {
    // 获取所有课程
    const courseMap = new Map<number, string>();
    mockMajorData.abilityCourseRel.forEach(rel => {
      courseMap.set(rel.courseId, rel.courseName);
    });

    return Array.from(courseMap.entries()).map(([courseId, courseName], index) => {
      const rowData: any = {
        key: (index + 1).toString(),
        name: courseName
      };

      // 为每个毕业要求添加关联关系
      for (let i = 1; i <= 8; i++) {
        const hasRelation = mockMajorData.abilityCourseRel.some(
          rel => rel.courseId === courseId && rel.abilityNo.startsWith(`${i}-`)
        );
        rowData[`req${i}`] = hasRelation;
      }

      return rowData;
    });
  }, []);

  // 渲染带有标签的单元格
  const renderCell = (value: boolean, record: any, dataIndex: string) => {
    return value ? <CheckOutlined className={styles.checkIcon} /> : null;
  };

  // 动态生成矩阵表格列定义
  const matrixColumns = useMemo(() => {
    const columns = [
      {
        title: (
          <div className={styles.headerRequirement}>
            <div className={styles.headerTag}>毕业要求</div>
          </div>
        ),
        dataIndex: 'name',
        key: 'name',
        width: '420px',
        render: (text: string, record: any) => (
          <div className={styles.requirementCell}>
            <span>{record.id}. {text}</span>
          </div>
        ),
      }
    ];

    // 为每个培养目标添加列
    mockMajorData.cultivationTarget.targetList.forEach(target => {
      columns.push({
        title: `${target.targetName}`,
        dataIndex: `goal${target.targetNo}`,
        key: `goal${target.targetNo}`,
        width: '223px',
        align: 'center' as 'center',
        render: (value: boolean, record: any) => renderCell(value, record, `goal${target.targetNo}`),
      });
    });

    return columns;
  }, []);

  // 课程矩阵表格列定义
  const courseMatrixColumns = [
    {
      title: (
        <div className={styles.headerRequirement}>
          <div className={styles.headerTag}>课程名称</div>
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: '420px',
      render: (text: string) => (
        <div className={styles.requirementCell}>
          <span>{text}</span>
        </div>
      ),
    },
    ...Array.from({ length: 8 }, (_, i) => ({
      title: `${i + 1}`,
      dataIndex: `req${i + 1}`,
      key: `req${i + 1}`,
      width: '80px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    }))
  ];

  return (
    <div className={styles.container}>
      <div className={styles.labels}>人才培养方案</div>
      <div className={styles.traingoal}>培养目标</div>
      {/* 培养目标概述 */}
      <div className={styles.frame}>
        <div className={styles.goalLabel}>{mockMajorData.cultivationTarget.introduction}</div>
      </div>
       {/* 培养目标及描述展示卡片 */}
      <div className={styles.cardsContainer}>
        {mockMajorData.cultivationTarget.targetList.map((target) => (
          <div className={styles.abilityCard} key={target.targetNo}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{target.targetName}</h3>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.contentText}>
                <p className={styles.paragraphLast}>
                  {target.targetDescription}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.graduation}>毕业要求</div>
      <div style={{ marginTop: '17px' }}>
        {/* 毕业要求组件 */}
        <div className={styles.graduationRequirements}>
          {/* 左侧菜单按钮 */}
          <div className={styles.sideMenu}>
            {requirementItems.map((item) => (
              <Button
                key={item.id}
                className={`${styles.menuButton} ${selectedRequirement === item.id ? styles.active : ''}`}
                onClick={() => handleRequirementClick(item.id)}
              >
                {item.name}
              </Button>
            ))}
          </div>

          {/* 右侧内容区 */}
          <div className={styles.contentContainer}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>
                {selectedRequirement}. {requirementItems.find(item => item.id === selectedRequirement)?.name}
              </h2>
            </div>

            <div className={styles.contentBody}>
              <p className={styles.mainDescription}>
                {currentContent.description}
              </p>

              <div className={styles.requirementItems}>
                {currentContent.details.map((detail, index) => (
                  <p key={index}>{detail}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.abilityGoalRel}>毕业要求与培养目标矩阵</div>

      {/* 添加毕业要求与培养目标矩阵表格 */}
      <div className={styles.matrixContainer}>
        <Table
          columns={matrixColumns}
          dataSource={matrixData}
          pagination={false}
          bordered
          className={styles.matrixTable}
          rowClassName={(record, index) => index % 2 === 0 ? styles.evenRow : styles.oddRow}
          size="middle"
        />
      </div>

      <div className={styles.courseAbilityRel}>课程体系与毕业要求矩阵</div>

      {/* 课程体系与毕业要求矩阵表格 */}
      <div className={styles.matrixContainer}>
        <Table
          columns={courseMatrixColumns}
          dataSource={courseMatrixData}
          pagination={false}
          bordered
          className={styles.courseMatrixTable}
          rowClassName={(record, index) => index % 2 === 0 ? styles.evenRow : styles.oddRow}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  );
};

export default ContentPage;