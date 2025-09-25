import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, Form, Space, Modal, message, Input, DatePicker, InputNumber, Select } from 'antd';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table';
const { RangePicker } = DatePicker;

interface StudentProps {
  key: number;
  teacherId: string;
  school: string;
  startTime: string;
  endTime: string;
  usedQuota: number; // 已使用额度
  totalQuota: number; // 总额度
  createNumber: string; // 显示用的格式化字符串
}

const Student: React.FC = () => {
  const [dataSource, setDataSource] = useState<StudentProps[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudentProps | null>(null);
  const [form] = Form.useForm();

  // 学校选项
  const schoolOptions = [
    { label: '北京大学', value: '北京大学' },
    { label: '清华大学', value: '清华大学' },
    { label: '复旦大学', value: '复旦大学' },
    { label: '上海交通大学', value: '上海交通大学' },
    { label: '浙江大学', value: '浙江大学' },
  ];

  // 定义表格
  const columns: ColumnsType<StudentProps> = [
    {
      title: '老师ID',
      dataIndex: 'teacherId',
      key: 'teacherId',
      width: 80,
      align: 'center'
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      width: 120,
      align: 'center'
    },
    {
      title: '权限时间',
      key: 'duration',
      width: 200,
      render: (record) => `${record.startTime} 至 ${record.endTime}`,
      align: 'center'
    },
    {
      title: '创建学期额度',
      dataIndex: 'createNumber',
      key: 'createNumber',
      width: 120,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      )
    }
  ];

  // Mock API - 获取数据
  const fetchData = useCallback(async () => {
    try {
      // 模拟API调用
      const mockData: StudentProps[] = [
        {
          key: 1,
          teacherId: 'T001',
          school: '北京大学',
          startTime: '2025-02-02 12:00',
          endTime: '2025-03-09 00:00',
          usedQuota: 12,
          totalQuota: 1000,
          createNumber: '12/1000',
        },
        {
          key: 2,
          teacherId: 'T002',
          school: '清华大学',
          startTime: '2025-02-02 12:00',
          endTime: '2025-03-09 00:00',
          usedQuota: 8,
          totalQuota: 500,
          createNumber: '8/500',
        },
        // ... 其他数据
      ];
      setDataSource(mockData);
    } catch (error) {
      message.error('获取数据失败');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mock API - 添加记录
  const mockAddRecord = async (record: Omit<StudentProps, 'key' | 'createNumber' | 'usedQuota'>) => {
    const newRecord: StudentProps = {
      ...record,
      key: Date.now(),
      usedQuota: 0, // 新建时已使用额度为0
      createNumber: `0/${record.totalQuota}`,
    };
    return newRecord;
  };

  // Mock API - 更新记录
  const mockUpdateRecord = async (key: number, record: Partial<StudentProps>) => {
    const updatedRecord = {
      ...record,
      createNumber: `${record.usedQuota || 0}/${record.totalQuota}`,
    };
    return updatedRecord;
  };

  // Mock API - 删除记录
  const mockDeleteRecord = async (key: number) => {
    return true; // 模拟删除成功
  };

  // 显示添加弹窗
  const showAddModal = () => {
    setIsModalVisible(true);
    setIsEditModal(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // 编辑权限
  const handleEdit = (record: StudentProps) => {
    setIsModalVisible(true);
    setIsEditModal(true);
    setEditingRecord(record);
    
    // 正确回填数据
    form.setFieldsValue({
      teacherId: record.teacherId,
      school: record.school,
      dateRange: [dayjs(record.startTime), dayjs(record.endTime)],
      totalQuota: record.totalQuota, // 回填总额度，而不是已使用额度
    });
  };

  // 删除权限
  const handleDelete = (key: number) => {
    Modal.confirm({
      title: '确认删除',
      cancelText: '取消',
      okText: '确定',
      content: '确定要删除这条权限记录吗？',
      onOk: async () => {
        try {
          await mockDeleteRecord(key);
          setDataSource(prev => prev.filter(item => item.key !== key));
          message.success('删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const { teacherId, school, dateRange, totalQuota } = values;
      const [startTime, endTime] = dateRange;

      if (isEditModal && editingRecord) {
        // 编辑模式 - 更新现有记录
        const updatedData = {
          teacherId,
          school,
          startTime: startTime.format('YYYY-MM-DD HH:mm'),
          endTime: endTime.format('YYYY-MM-DD HH:mm'),
          totalQuota,
          usedQuota: editingRecord.usedQuota, // 保持原有的已使用额度
        };

        const result = await mockUpdateRecord(editingRecord.key, updatedData);
        
        setDataSource(prev => 
          prev.map(item => 
            item.key === editingRecord.key 
              ? { ...item, ...updatedData, ...result }
              : item
          )
        );
        message.success('更新成功');
      } else {
        // 新增模式 - 创建新记录
        const newRecordData = {
          teacherId,
          school,
          startTime: startTime.format('YYYY-MM-DD HH:mm'),
          endTime: endTime.format('YYYY-MM-DD HH:mm'),
          totalQuota,
        };

        const newRecord = await mockAddRecord(newRecordData);
        setDataSource(prev => [...prev, newRecord]);
        message.success('添加成功');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 取消弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', marginBottom: 8 }}>
          老师AI课堂权限
        </h2>
        <Button type="primary" onClick={showAddModal} style={{background: "#00cc7e"}}>
          添加AI课堂权限
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        bordered
      />
      
      <Modal
        title={`${isEditModal ? '编辑' : '添加'}老师AI课堂权限`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: '20px' }}
        >
          <Form.Item
            label="老师ID"
            name="teacherId"
            rules={[
              { required: true, message: '请输入老师ID' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '请输入合法的老师ID' }
            ]}
          >
            <Input placeholder="请输入老师ID" />
          </Form.Item>

          <Form.Item
            label="学校"
            name="school"
            rules={[{ required: true, message: '请选择学校' }]}
          >
            <Input placeholder="请选择学校" />
          </Form.Item>

          <Form.Item
            label="权限时长"
            name="dateRange"
            rules={[{ required: true, message: '请选择权限时长' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <Form.Item
            label="学期总额度"
            name="totalQuota"
            rules={[
              { required: true, message: '请输入学期总额度' },
              { type: 'number', min: 1, message: '请输入大于0的数值' }
            ]}
          >
            <InputNumber
              placeholder="请输入学期总额度"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Student;