import React, { useState, useCallback } from 'react';
import { Table, Select, Button, Card, Typography, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './index.css'; // 样式文件

const { Title, Text } = Typography;
const { Option } = Select;

// 关系类型定义
type RelationType = 'related' | 'unrelated';

// 矩阵数据项接口
interface MatrixItem {
  rowId: string;
  columnId: string;
  relation: RelationType;
}

// 毕业要求数据
interface GraduationRequirement {
  id: string;
  name: string;
}

// 培养目标数据
interface TrainingObjective {
  id: string;
  name: string;
}

// 表格行数据结构
interface TableRowData {
  key: string;
  requirement: string;
  [key: string]: string | RelationType; // 动态列数据
}

const MatrixTable: React.FC = () => {
  // 毕业要求数据
  const [graduationRequirements] = useState<GraduationRequirement[]>([
    { id: 'req1', name: '毕业要求1XXX' },
    { id: 'req2', name: '毕业要求2XXX' },
    { id: 'req3', name: '毕业要求3XXX' },
  ]);

  // 培养目标数据
  const [trainingObjectives] = useState<TrainingObjective[]>([
    { id: 'obj1', name: '培养目标1XXXX' },
    { id: 'obj2', name: '培养目标2XXXX' },
  ]);

  // 矩阵关系数据
  const [matrixData, setMatrixData] = useState<MatrixItem[]>(() => {
    // 初始化所有组合为"相关"
    const initialData: MatrixItem[] = [];
    graduationRequirements.forEach(req => {
      trainingObjectives.forEach(obj => {
        initialData.push({
          rowId: req.id,
          columnId: obj.id,
          relation: 'related'
        });
      });
    });
    return initialData;
  });

  // 获取特定位置的关系值
  const getRelation = useCallback((rowId: string, columnId: string): RelationType => {
    const item = matrixData.find(item => item.rowId === rowId && item.columnId === columnId);
    return item?.relation || 'related';
  }, [matrixData]);

  // 更新关系值
  const updateRelation = useCallback((rowId: string, columnId: string, relation: RelationType) => {
    setMatrixData(prev => prev.map(item => 
      item.rowId === rowId && item.columnId === columnId 
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
        <Option value="related">
          <span style={{ color: '#52c41a' }}>L</span>
        </Option>
        <Option value="unrelated">
          <span style={{ color: '#ff4d4f' }}>M</span>
        </Option>

        <Option value="unrelated">
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
      width: 200,
      fixed: 'left',
      className: 'matrix-header-column',
      render: (text: string) => (
        <div className="requirement-cell">
          <Text strong>{text}</Text>
        </div>
      ),
    },
    ...trainingObjectives.map(obj => ({
      title: (
        <div className="objective-header">
          <Text strong>{obj.name}</Text>
        </div>
      ),
      dataIndex: obj.id,
      key: obj.id,
      width: 150,
      align: 'center' as const,
      className: 'matrix-data-column',
      render: (_: any, record: TableRowData) => 
        renderSelectCell(record.key, obj.id),
    }))
  ];

  // 构建表格数据
  const tableData: TableRowData[] = graduationRequirements.map(req => {
    const rowData: TableRowData = {
      key: req.id,
      requirement: req.name,
    };
    
    // 添加每个培养目标对应的数据
    trainingObjectives.forEach(obj => {
      rowData[obj.id] = getRelation(req.id, obj.id);
    });
    
    return rowData;
  });

  // 保存数据
  const handleSave = () => {
    console.log('Matrix Data:', matrixData);
    
    // 统计相关性
    const relatedCount = matrixData.filter(item => item.relation === 'related').length;
    const totalCount = matrixData.length;
    
    message.success(`保存成功！共 ${totalCount} 项关系，其中 ${relatedCount} 项相关`);
  };

  // 重置为默认值
  const handleReset = () => {
    setMatrixData(prev => prev.map(item => ({ ...item, relation: 'related' as RelationType })));
    message.info('已重置为默认关系（全部相关）');
  };

  return (
    <div className="matrix-container">
  
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