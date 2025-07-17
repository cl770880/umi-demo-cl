import React, { useState } from 'react';
import { Layout, Card, Button, Tag, message, Modal, Input, Form, Table } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './Component1.module.css';

const { Content } = Layout;
const { TextArea } = Input;

const ContentPage: React.FC = () => {
  // 毕业要求组件所需的状态
  const [selectedRequirement, setSelectedRequirement] = useState('1');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // 定义毕业要求数据
  const requirementItems = [
    { id: '1', name: '工程知识' },
    { id: '2', name: '问题分析' },
    { id: '3', name: '设计/开发解决方案' },
    { id: '4', name: '研究' },
    { id: '5', name: '使用现代工具' },
    { id: '6', name: '工程与社会' },
    { id: '7', name: '环境和可持续发展' },
    { id: '8', name: '职业规范' },
  ];
  
  // 当前选中项的内容
  const [contentMap, setContentMap] = useState({
    '1': {
      description: '能够将数学、自然科学知识以及相关的工程基础理论和专业知识用于解决智能硬件设计、信号与信息处理等电子信息领域相关的复杂工程问题',
      details: [
        '1.1 掌握数学、自然科学、工程基础知识以及软件工程专业知识。',
        '1.2 具备将工程基础和专业知识用于识别、表达、分析和解决复杂工程问题的能力。',
        '1.3 能够理解和掌握软件工程的基本原理、方法和技术，能够应用这些原理、方法和技术解决复杂工程问题。',
        '1.4 能够在实践中灵活运用所学知识分析、设计、开发和维护软件系统，能够综合运用所学知识解决工程问题。'
      ]
    },
    '2': {
      description: '能够应用数学、自然科学和工程科学的基本原理，识别、表达、并通过文献研究分析电子信息领域的复杂工程问题，以获得有效结论',
      details: [
        '2.1 能够认识到软件工程问题的复杂性，并能够利用科学方法对问题进行识别和表达。',
        '2.2 能够应用数学、自然科学和工程科学原理分析复杂工程问题。',
        '2.3 能够通过文献研究和调查，建立软件工程问题的分析模型并获得有效结论。'
      ]
    },
    '3': { 
      description: '能够设计针对复杂工程问题的解决方案，设计满足特定需求的系统、单元或工艺流程，并能够在设计环节中体现创新意识，考虑社会、健康、安全、法律、文化以及环境等因素',
      details: ['3.1 能够设计满足特定需求的软件系统或组件，包括用户界面、数据结构、算法等。', '3.2 在设计过程中能够考虑社会、安全、法律、文化等多方面因素。'] 
    },
    '4': { 
      description: '能够基于科学原理并采用科学方法对电子信息领域的复杂工程问题进行研究，包括设计实验、分析与解释数据、并通过信息综合得到合理有效的结论',
      details: ['4.1 能够设计并执行实验方案，分析和解释实验数据。', '4.2 能够通过数据分析得出有效结论。'] 
    },
    '5': { 
      description: '能够针对电子信息领域的复杂工程问题，开发、选择与使用恰当的技术、资源、现代工程工具和信息技术工具，包括对电子信息领域复杂工程问题的预测与模拟，并能够理解其局限性',
      details: ['5.1 能够选择和使用合适的开发工具和框架进行软件开发。', '5.2 能够理解各种技术工具的适用场景和局限性。'] 
    },
    '6': { 
      description: '能够基于工程相关背景知识进行合理分析，评价电子信息专业工程实践和复杂工程问题解决方案对社会、健康、安全、法律以及文化的影响，并理解应承担的责任',
      details: ['6.1 了解软件工程实践对社会、健康、安全的影响。', '6.2 理解软件工程师的职业责任和道德规范。'] 
    },
    '7': { 
      description: '能够理解和评价针对电子信息领域复杂工程问题的工程实践对环境、社会可持续发展的影响',
      details: ['7.1 了解软件系统在环境保护和可持续发展中的作用。', '7.2 能够设计环保节能的软件系统。'] 
    },
    '8': { 
      description: '具有人文社会科学素养、社会责任感，能够在工程实践中理解并遵守工程职业道德和规范，履行责任',
      details: ['8.1 具有良好的职业道德和规范意识。', '8.2 能够在团队合作中履行自己的责任。'] 
    },
  });
  
  const handleRequirementClick = (id: string) => {
    setSelectedRequirement(id);
  };

  // 获取当前选中项的内容
  const currentContent = contentMap[selectedRequirement] || contentMap['1'];

  const showEditModal = () => {
    form.setFieldsValue({
      description: currentContent.description,
      details: currentContent.details.join('\n')
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSave = () => {
    form.validateFields().then(values => {
      const newContentMap = { ...contentMap };
      newContentMap[selectedRequirement] = {
        description: values.description,
        details: values.details.split('\n').filter(item => item.trim() !== '')
      };
      
      setContentMap(newContentMap);
      setIsEditModalVisible(false);
      message.success('保存成功');
    });
  };

  // 毕业要求与培养目标矩阵数据
  const matrixData = [
    { key: '1', id: '1', name: '工程知识', goal1: true, goal2: false, goal3: false, goal4: false, tagColor: '#ff9559' },
    { key: '2', id: '2', name: '问题分析', goal1: true, goal2: false, goal3: false, goal4: false },
    { key: '3', id: '3', name: '设计/开发解决方案', goal1: false, goal2: false, goal3: true, goal4: false },
    { key: '4', id: '4', name: '研究', goal1: true, goal2: true, goal3: false, goal4: false },
    { key: '5', id: '5', name: '使用现代工具', goal1: true, goal2: true, goal3: false, goal4: false },
    { key: '6', id: '6', name: '工程与社会', goal1: false, goal2: false, goal3: false, goal4: true },
    { key: '7', id: '7', name: '环境与可持续发展', goal1: false, goal2: false, goal3: false, goal4: true, tagColor: '#ff5454' },
    { key: '8', id: '8', name: '职业规范', goal1: false, goal2: false, goal3: false, goal4: true },
    { key: '9', id: '9', name: '个人和团队', goal1: false, goal2: false, goal3: false, goal4: true },
    { key: '10', id: '10', name: '沟通能力', goal1: false, goal2: false, goal3: false, goal4: true },
    { key: '11', id: '11', name: '项目管理', goal1: false, goal2: true, goal3: false, goal4: false },
    { key: '12', id: '12', name: '终身学习', goal1: false, goal2: false, goal3: false, goal4: true },
  ];

  // 课程体系与毕业要求矩阵数据
  const courseMatrixData = [
    { key: '1', name: '高等数学与方程基础', req1: true, req2: true, req3: true, req4: true, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: false, req12: false },
    { key: '2', name: '中国近现代史纲要', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: true, req8: true, req9: false, req10: false, req11: false, req12: false },
    { key: '3', name: '马克思主义基本原理', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: true, req8: true, req9: false, req10: false, req11: false, req12: false },
    { key: '4', name: '毛泽东思想和中国特色社会主义理论体系概论', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: false, req12: true },
    { key: '5', name: '可视化原理与中国特色社会主义工程实践', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: false, req12: true },
    { key: '6', name: '思想与政治', req1: false, req2: false, req3: false, req4: false, req5: false, req6: true, req7: true, req8: false, req9: false, req10: false, req11: false, req12: false },
    { key: '7', name: '中国文化概论', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: true, req12: false },
    { key: '8', name: '军事理论', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: true, req12: true },
    { key: '9', name: '国家安全教育', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: true, req12: false },
    { key: '10', name: '大学英语(读写、听说)', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: true, req11: false, req12: false },
    { key: '11', name: '程序设计基础(C)', req1: true, req2: false, req3: false, req4: true, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: false, req12: false },
    { key: '12', name: '大学物理', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: true, req10: true, req11: false, req12: false },
    { key: '13', name: '大学心理健康课', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: true, req10: false, req11: false, req12: false },
    { key: '14', name: '专业毕业与训练', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: true, req12: false },
    { key: '15', name: '工程数学', req1: true, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: false, req12: true },
    { key: '16', name: '工程概率与统计', req1: false, req2: false, req3: false, req4: false, req5: false, req6: false, req7: false, req8: false, req9: false, req10: false, req11: true, req12: true }
  ];

  // 渲染带有标签的单元格
  const renderCell = (value: boolean, record: any, dataIndex: string) => {
    // 对应单元格为第一行第一列，并且有标签
    if (dataIndex === 'goal1' && record.key === '1' && record.tagNumber) {
      return (
        <div className={styles.cellWithTag}>
          {value && <CheckOutlined className={styles.checkIcon} />}
          <div 
            className={styles.tag} 
            style={{ backgroundColor: record.tagColor || '#ff9559' }}
          >
            {record.tagNumber}
          </div>
        </div>
      );
    }
    // 环境与可持续发展行的第一列有标```jsx
    else if (dataIndex === 'goal1' && record.key === '7' && record.tagNumber) {
      return (
        <div className={styles.cellWithTag}>
          {value && <CheckOutlined className={styles.checkIcon} />}
          <div 
            className={styles.tag} 
            style={{ backgroundColor: record.tagColor || '#ff5454' }}
          >
            {record.tagNumber}
          </div>
        </div>
      );
    }
    // 普通单元格
    return value ? <CheckOutlined className={styles.checkIcon} /> : null;
  };

  // 矩阵表格列定义
  const matrixColumns = [
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
    },
    {
      title: '培养目标1',
      dataIndex: 'goal1',
      key: 'goal1',
      width: '223px',
      align: 'center' as 'center',
      render: (value: boolean, record: any) => renderCell(value, record, 'goal1'),
    },
    {
      title: '培养目标2',
      dataIndex: 'goal2',
      key: 'goal2',
      width: '223px',
      align: 'center' as 'center',
      render: (value: boolean, record: any) => renderCell(value, record, 'goal2'),
    },
    {
      title: '培养目标3',
      dataIndex: 'goal3',
      key: 'goal3',
      width: '223px',
      align: 'center' as 'center',
      render: (value: boolean, record: any) => renderCell(value, record, 'goal3'),
    },
    {
      title: '培养目标4',
      dataIndex: 'goal4',
      key: 'goal4',
      width: '223px',
      align: 'center' as 'center',
      render: (value: boolean, record: any) => renderCell(value, record, 'goal4'),
    },
  ];

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
    {
      title: '1',
      dataIndex: 'req1',
      key: 'req1',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '2',
      dataIndex: 'req2',
      key: 'req2',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '3',
      dataIndex: 'req3',
      key: 'req3',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '4',
      dataIndex: 'req4',
      key: 'req4',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '5',
      dataIndex: 'req5',
      key: 'req5',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '6',
      dataIndex: 'req6',
      key: 'req6',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '7',
      dataIndex: 'req7',
      key: 'req7',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '8',
      dataIndex: 'req8',
      key: 'req8',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '9',
      dataIndex: 'req9',
      key: 'req9',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '10',
      dataIndex: 'req10',
      key: 'req10',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '11',
      dataIndex: 'req11',
      key: 'req11',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
    {
      title: '12',
      dataIndex: 'req12',
      key: 'req12',
      width: '60px',
      align: 'center' as 'center',
      render: (value: boolean) => value ? <CheckOutlined className={styles.checkIcon} /> : null,
    },
  ];

  return (
    <div style={{width:'1440px'}}>
      <div className={styles.labels}>人才培养方案</div>
      <div className={styles.traingoal}>培养目标</div>
      <div className={styles.frame} >
        <div className={styles.goalLabel}>本专业旨在培养具有社会主义核心价值观，基于创新性和专业文化培养与继承意识，具有社会责任感，公民意识，国际视野和创新精神，掌握扎实的专业知识基本理论与技能，熟悉国际信息技术发展趋势，了解我国信息产业发展需求，具有良好的团队协作精神，具备参与复杂工程问题分析与解决的初步能力，勇于创新，团结协作，创业型人才，本专业毕业生适合在政府、科研机构、企业和各类组织中从事软件开发、系统分析、项目管理等工作，以及继续攻读相关专业。</div>
      </div>

      <div style={{display: 'flex'}}>
        {[1,2,3].map((index)=>{
          return (
            <div className={styles.frameExtraParent} key={index}>
              <div className={styles.frameExtra} />
              <div className={styles.frameExtratext}>
                <div className={styles.frameExtratext1} />
                <div className={styles.labels1}>知识要求</div>
              </div>
              <div className={styles.labels2}>
                <span className={styles.labelsTxt}>
                  <p className={styles.p}>具备以下基础知识和专业知识：</p>
                  <p className={styles.p}>（1）掌握数学和自然科学基本原理，以及相关的人文社会科学知识，能够在工程实践中应用。</p>
                  <p className={styles.p}>（2）掌握计算机科学与技术的基本理论、基本知识和基本技能，以及软件工程专业的基本理论、基本知识和基本技能，以及相关的专业知识。</p>
                  <p className={styles.p3}>（3）掌握软件需求分析、软件设计、软件测试、软件维护等软件工程基本方法，以及软件项目管理的基本知识。</p>
                </span>
              </div>
              <div className={styles.component306}>
                <div className={styles.component306Child} />
                <div className={styles.labelsMoveToParent}>关联3个毕业要求</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.graduation}>毕业要求</div>
      <div style={{marginTop:'17px'}}>
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
              <Button className={styles.editButton} icon={<EditOutlined />} onClick={showEditModal}>
                编辑
              </Button>
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

            <div className={styles.contentFooter}>
              <button className={styles.tagButton}>关联3个培养目标</button>
              <button className={styles.tagButton}>关联45个课程</button>
            </div>
          </div>
        </div>

        {/* 编辑弹窗 */}
        <Modal
          title="编辑毕业要求"
          open={isEditModalVisible}
          onCancel={handleEditCancel}
          onOk={handleEditSave}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="details"
              label="细则（每行一条）"
              rules={[{ required: true, message: '请输入细则' }]}
            >
              <TextArea rows={8} />
            </Form.Item>
          </Form>
        </Modal>
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
          scroll={{ x: 1313 }}
        />
      </div>
    </div>
  );
};

export default ContentPage;