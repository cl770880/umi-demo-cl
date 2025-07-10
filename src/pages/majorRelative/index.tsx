// majorRelative.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { Table, Select, Button, Typography, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.css'; // 样式文件

const { Title, Text } = Typography;
const { Option } = Select;

// 关系类型定义
type RelationType = 'L' | 'M' | 'H';

// 矩阵数据项接口
interface MatrixItem {
  rowId: string;
  columnId: string;
  relation: RelationType;
}

// 培养目标接口
interface TrainingGoal {
  title: string;
  description: string;
}

// 子能力接口
interface SubAbility {
  name: string;
}

// 毕业能力要求接口
interface GraduationAbility {
  ability: string;
  description: string;
  subAbilities: SubAbility[];
}

// 表格行数据结构
interface TableRowData {
  key: string;
  requirement: string;
  [key: string]: string | RelationType; // 动态列数据
}

// 组件属性接口
interface MatrixTableProps {
  trainingGoals: TrainingGoal[];
  graduationAbilities: GraduationAbility[];
}

const MatrixTable: React.FC<MatrixTableProps> = ({ trainingGoals, graduationAbilities }) => {
  // 矩阵关系数据
  const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);

  // 当培养目标或毕业能力要求数据变化时，更新矩阵数据
  useEffect(() => {
    if (trainingGoals.length > 0 && graduationAbilities.length > 0) {
      // 初始化所有组合为"L"级别的相关性
      const initialData: MatrixItem[] = [];
      graduationAbilities.forEach((req, reqIndex) => {
        trainingGoals.forEach((obj, objIndex) => {
          initialData.push({
            rowId: `req${reqIndex}`,
            columnId: `obj${objIndex}`,
            relation: 'L'
          });
        });
      });
      setMatrixData(initialData);
    }
  }, [trainingGoals, graduationAbilities]);

  // 获取特定位置的关系值
  const getRelation = useCallback((rowId: string, columnId: string): RelationType => {
    const item = matrixData.find(item => item.rowId === rowId && item.columnId === columnId);
    return item?.relation || 'L';
  }, [matrixData]);

  // 更新关系值
  const updateRelation = useCallback((rowid: string, columnId: string, relation: RelationType) => {
    setMatrixData(prev => prev.map(item => 
      item.rowId === rowid && item.columnId === columnId 
        ? { ...item, relation }
        : item
    ));
  }, []);

  // 渲染下拉选择框
  const renderSelectCell = useCallback((rowId: string, columnId: string) => {
    const currentValue = getRelation(rowId, columnId);
    
    return (
      <Select
        value={currentValue}
        onChange={(value: RelationType) => updateRelation(rowId, columnId, value)}
        style={{ width: '100%', minWidth: 100 }}
        size="small"
      >
        <Option value="L">
          <span style={{ color: '#52c41a' }}>L</span>
        </Option>
        <Option value="M">
          <span style={{ color: '#faad14' }}>M</span>
        </Option>
        <Option value="H">
          <span style={{ color: '#ff4d4f' }}>H</span>
        </Option>
      </Select>
    );
  }, [getRelation, updateRelation]);

  // 构建表格列配置
  const columns: ColumnsType<TableRowData> = [
    {
      title: '毕业能力要求',
      dataIndex: 'requirement',
      key: 'requirement',
      width: 150,
      fixed: 'left',
      align: 'center' as const,
      className: 'matrix-header-column',
      render: (text: string) => (
        <div className="requirement-cell">
          <Text strong>{text}</Text>
        </div>
      ),
    },
    ...trainingGoals.map((obj, index) => ({
      title: (
        <div className="objective-header">
          <Text strong>{obj.title}</Text>
        </div>
      ),
      dataIndex: `obj${index}`,
      key: `obj${index}`,
      width: 150,
      align: 'center' as const,
      className: 'matrix-data-column',
      render: (_: any, record: TableRowData) => 
        renderSelectCell(record.key, `obj${index}`),
    }))
  ];

  // 构建表格数据
  const tableData: TableRowData[] = graduationAbilities.map((req, index) => {
    const rowData: TableRowData = {
      key: `req${index}`,
      requirement: req.ability,
    };
    
    // 添加每个培养目标对应的数据
    trainingGoals.forEach((obj, objIndex) => {
      rowData[`obj${objIndex}`] = getRelation(`req${index}`, `obj${objIndex}`);
    });
    
    return rowData;
  });

  // 保存数据
  const handleSave = () => {
    console.log('Matrix Data:', matrixData);
    
    // 统计各级别相关性
    const lCount = matrixData.filter(item => item.relation === 'L').length;
    const mCount = matrixData.filter(item => item.relation === 'M').length;
    const hCount = matrixData.filter(item => item.relation === 'H').length;
    const totalCount = matrixData.length;
    
    message.success(`保存成功！共 ${totalCount} 项关系，其中 L级:${lCount}项, M级:${mCount}项, H级:${hCount}项`);
  };

  // 重置为默认值
  const handleReset = () => {
    setMatrixData(prev => prev.map(item => ({ ...item, relation: 'L' as RelationType })));
    message.info('已重置为默认关系（全部为L级）');
  };

  // 如果没有培养目标或毕业能力要求数据，显示提示信息
  if (trainingGoals.length === 0 || graduationAbilities.length === 0) {
    return (
      <div className="matrix-container">
        <Title level={5}>培养目标与毕业能力相关矩阵</Title>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">
            请先在上方填写并保存培养目标和毕业能力要求，矩阵将自动更新
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="matrix-container">
      <Title level={5}>培养目标与毕业能力相关矩阵</Title>
  
        <div className="matrix-table-wrapper">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            bordered
            size="middle"
            scroll={{ x: 800 }}
            className="matrix-table"
          />
        </div>

        <div className="matrix-actions">
          <Space>
            <Button type="primary" onClick={handleSave} size="large">
              保存
            </Button>
            <Button onClick={handleReset} size="large">
              重置
            </Button>
          </Space>
        </div>
    </div>
  );
};

export default MatrixTable;