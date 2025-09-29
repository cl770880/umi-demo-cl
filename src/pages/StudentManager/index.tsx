import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Select,
  Input,
  Button,
  Modal,
  InputNumber,
  Radio,
  message,
  Checkbox,
  Space,
  Pagination,
  Empty,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  UsergroupAddOutlined,
  TeamOutlined,
  DeleteOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

const { Search } = Input;
const { Option } = Select;

// 简化的学生接口
interface Student {
  memberId: string;
  nickName: string;
  realName: string;
  verifyStatus: boolean;
  number: string;
  groupId?: string;
  groupName?: string;
  checked?: boolean;
}

interface Group {
  id: string;
  groupName: string;
}

interface PaginationInfo {
  pageIndex: number;
  totalCount: number;
  totlePageCount: number;
}

interface Props {
  classId: string;
}

// 排序常量
const SORT_TYPE = {
  SIGNIN: 'signin',
  PAPER: 'paper',
  FORUM: 'forum',
  ROLLCALL: 'rollcall',
  GRADE: 'grade',
  NUMBER: 'number',
};

const ORDER = {
  UP: 0,
  DOWN: 1,
};

const StudentManagement: React.FC<Props> = ({ classId }) => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [studentInfo, setStudentInfo] = useState<Student[]>([]);
  const [groupNameList, setGroupNameList] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [totalNum, setTotalNum] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [sortType, setSortType] = useState('');
  const [order, setOrder] = useState<number>(ORDER.UP);
  const [checkedMemberIdList, setCheckedMemberIdList] = useState<string[]>([]);
  const [checkedAllState, setCheckedAllState] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    pageIndex: 1,
    totalCount: 0,
    totlePageCount: 1,
  });

  // 模态框状态
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
  const [clearGroupModalVisible, setClearGroupModalVisible] = useState(false);
  const [disbandGroupModalVisible, setDisbandGroupModalVisible] = useState(false);
  const [moveGroupModalVisible, setMoveGroupModalVisible] = useState(false);
  
  // 表单数据
  const [groupMemberNumber, setGroupMemberNumber] = useState<number>(0);
  const [newGroupName, setNewGroupName] = useState('');
  const [movetoGroupId, setMovetoGroupId] = useState<string>('');

  // Mock数据
  const mockStudentData: Student[] = [
    {
      memberId: '1',
      nickName: '张三同学',
      realName: '张三',
      verifyStatus: true,
      number: '2021001',
      groupId: 'g1',
      groupName: '第一组',
    },
    {
      memberId: '2',
      nickName: '李四学长',
      realName: '李四',
      verifyStatus: false,
      number: '2021002',
      groupId: 'g1',
      groupName: '第一组',
    },
    {
      memberId: '3',
      nickName: '王五小朋友',
      realName: '王五',
      verifyStatus: true,
      number: '2021003',
      groupName: '未分组',
    },
    {
      memberId: '4',
      nickName: '赵六666',
      realName: '赵六',
      verifyStatus: true,
      number: '2021004',
      groupId: 'g2',
      groupName: '第二组',
    },
   
  ];

  const mockGroupData: Group[] = [
    { id: 'g1', groupName: '第一组' },
    { id: 'g2', groupName: '第二组' },
  ];

  // 模拟API调用
  const getStuManageList = useCallback(async (params: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockStudentData];
      
      if (params.keyword) {
        filteredData = filteredData.filter(student => 
          student.nickName.includes(params.keyword) ||
          student.realName.includes(params.keyword) ||
          student.number.includes(params.keyword)
        );
      }
      
      if (params.groupId) {
        if (params.groupId === '-1') {
          filteredData = filteredData.filter(student => !student.groupId);
        } else {
          filteredData = filteredData.filter(student => student.groupId === params.groupId);
        }
      }
      
      setStudentInfo(filteredData);
      setTotalNum(filteredData.length);
      setPagination({
        pageIndex: params.pageIndex || 1,
        totalCount: filteredData.length,
        totlePageCount: Math.ceil(filteredData.length / (params.pageSize || 20)),
      });
    } catch (error) {
      console.error('获取学生列表失败', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupList = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setGroupNameList(mockGroupData);
    } catch (error) {
      console.error('获取分组列表失败', error);
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    getGroupList();
    getStuManageList({ pageIndex: 1, pageSize: 20, classroomId: classId });
  }, [classId, getStuManageList, getGroupList]);

  // 计算是否有分组
  const hasCountGroup = studentInfo.some(student => student.groupId);

  // 获取排序样式类名
  const getSortClass = (sortTypeParam: string) => {
    if (sortTypeParam !== sortType) {
      return 'default';
    }
    return order === ORDER.UP ? 'up' : 'down';
  };

  // 判断是否显示SPOC在线状态
  const isShowSpocOnline = () => {
    return (
      (window as any).courseDto?.productType !== '4' &&
      ['10', '15', '20'].indexOf((window as any).courseDto?.mode) > -1
    );
  };

  // 定义表格列配置
  const tableColumns: ColumnsType<Student> = [
    ...(groupId ? [{
      title: (
        <Checkbox 
          checked={checkedAllState}
          onChange={(e) => handleCheckedAll(e.target.checked)}
        />
      ),
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: (_: any, record: Student) => (
        <Checkbox
          checked={checkedMemberIdList.includes(record.memberId)}
          onChange={(e) => handleCheckedMember(record.memberId, e.target.checked)}
        />
      ),
    }] : []),
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '本校认证状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      render: (status: boolean) => status ? '已认证' : '未认证',
    },
    {
      title: (
        <span>
          学号
          
        </span>
      ),
      dataIndex: 'number',
      key: 'number',
    },
    ...(isShowSpocOnline() ? [{
      title: '认证状态',
      dataIndex: 'verifyStatus',
      key: 'spocVerifyStatus',
      render: (status: boolean) => status ? '已认证' : '未认证',
    }] : []),
    ...(groupNameList.length > 0 ? [{
      title: '分组',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (groupName: string) => groupName && groupName !== '-' ? groupName : '未分组',
    }] : []),
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Student) => (
        <Button 
          type="link" 
          danger
          onClick={() => handleKickout(record)}
        >
          踢出课堂
        </Button>
      ),
    },
  ];

  

  

  // 事件处理函数
  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();
    setKeyword(trimmedValue);
    getStuManageList({
      pageIndex: 1,
      pageSize: 20,
      classroomId: classId,
      keyword: trimmedValue,
      groupId,
    });
  };

  const handleGroupFilterChange = (value: string) => {
    const newGroupId = value === '' ? null : value;
    setGroupId(newGroupId);
    setCheckedAllState(false);
    setCheckedMemberIdList([]);
    getStuManageList({
      pageIndex: 1,
      pageSize: 20,
      classroomId: classId,
      keyword,
      groupId: newGroupId,
    });
  };

  const handleSort = (sortTypeParam: string) => {
    let newOrder = ORDER.UP;
    if (sortType === sortTypeParam) {
      newOrder = order === ORDER.UP ? ORDER.DOWN : ORDER.UP;
    }
    setSortType(sortTypeParam);
    setOrder(newOrder);
    
    getStuManageList({
      pageIndex: pagination.pageIndex,
      pageSize: 20,
      classroomId: classId,
      keyword,
      groupId,
      [`${sortTypeParam}Sort`]: newOrder,
    });
  };

  const handlePageChange = (page: number) => {
    getStuManageList({
      pageIndex: page,
      pageSize: 20,
      classroomId: classId,
      keyword,
      groupId,
    });
  };

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    } finally {
      setExporting(false);
    }
  };

  const handleKickout = (student: Student) => {
    const name = student.realName ? `${student.nickName}_${student.realName}` : student.nickName;
    Modal.confirm({
      title: '确认操作',
      content: `确认将${name}从课堂中踢出？`,
      onOk: async () => {
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500));
          message.success('踢出成功!');
          getStuManageList({
            pageIndex: 1,
            pageSize: 20,
            classroomId: classId,
            keyword,
            groupId,
          });
        } catch (error) {
          message.error('踢出失败！');
        }
      },
    });
  };

  const handleCheckedAll = (checked: boolean) => {
    setCheckedAllState(checked);
    if (checked) {
      const allIds = studentInfo.map(student => student.memberId);
      setCheckedMemberIdList(allIds);
    } else {
      setCheckedMemberIdList([]);
    }
  };

  const handleCheckedMember = (memberId: string, checked: boolean) => {
    let newCheckedList = [...checkedMemberIdList];
    if (checked) {
      newCheckedList.push(memberId);
    } else {
      newCheckedList = newCheckedList.filter(id => id !== memberId);
    }
    setCheckedMemberIdList(newCheckedList);
  };

  // 分组相关操作
  const showGroupModal = () => {
    if (studentInfo.length <= 2) {
      message.warning('当前课堂人数大于2人才可以进行随机分组');
      return;
    }
    setGroupModalVisible(true);
  };

  const handleFullGroup = async () => {
    if (groupMemberNumber > studentInfo.length) {
      message.error('分组人数不能大于当前课堂人数!');
      return;
    }
    if (groupMemberNumber <= 1) {
      message.error('每组人数需大于1且小于课堂总人数!');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('分组成功');
      setGroupModalVisible(false);
      resetTable();
    } catch (error) {
      message.error('分组失败');
    }
  };

  const handleNewGroup = async () => {
    const groupName = newGroupName || '新分组';
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('创建分组成功');
      setNewGroupModalVisible(false);
      setNewGroupName('');
      resetTable();
    } catch (error) {
      message.error('创建分组失败');
    }
  };

  const handleClearGroup = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('清空分组成功');
      setClearGroupModalVisible(false);
      setGroupNameList([]);
      resetTable();
    } catch (error) {
      message.error('清空分组失败');
    }
  };

  const handleDisbandGroup = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('解散小组成功');
      setDisbandGroupModalVisible(false);
      resetTable();
    } catch (error) {
      message.error('解散小组失败');
    }
  };

  const handleMoveGroup = () => {
    if (!checkedMemberIdList.length) {
      message.warning('请先选择需要移动的学生！');
      return;
    }
    setMoveGroupModalVisible(true);
  };

  const handleMoveGroupConfirm = async () => {
    if (movetoGroupId === groupId) {
      message.error('不能移动到同一组！');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('移动成功');
      setMoveGroupModalVisible(false);
      setMovetoGroupId('');
      resetTable();
    } catch (error) {
      message.error('移动失败');
    }
  };

  const resetTable = () => {
    setGroupId(null);
    setCheckedMemberIdList([]);
    setCheckedAllState(false);
    getGroupList();
    getStuManageList({
      pageIndex: 1,
      pageSize: 20,
      classroomId: classId,
    });
  };

  return (
    <div className="u-stu-manage-container">
      <div className="title">
        学生管理
        <div className="totalNum">总人数: {totalNum} 人</div>
      </div>

      <div className="table-head">
        

        <div className="right">

          <Space className="button-group">
            {hasCountGroup ? (
              groupId ? (
                <>
                  <Button 
                    icon={<SwapOutlined />} 
                    onClick={handleMoveGroup}
                  >
                    移动组员
                  </Button>
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => setDisbandGroupModalVisible(true)}
                  >
                    解散小组
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                  type='primary'
                  className="addButton"
                    onClick={() => setNewGroupModalVisible(true)}
                  >
                    新建小组
                  </Button>
                  <Button 
                    onClick={() => setClearGroupModalVisible(true)}
                  >
                    清空小组
                  </Button>
                </>
              )
            ) : (
              <Button 
                onClick={showGroupModal}
              >
                学生分组
              </Button>
            )}
            
            <Button 
              onClick={handleExport}
              loading={exporting}
            >
              导出数据
            </Button>
          </Space>
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Select
          className="group-filter"
          value={groupId || ''}
          onChange={handleGroupFilterChange}
          style={{ 
            visibility: groupNameList.length === 0 ? 'hidden' : 'visible',
           
          }}
          placeholder="选择分组"
        >
          <Option value="">全部</Option>
          <Option value="-1">未分组</Option>
          {groupNameList.map(item => (
            <Option key={item.id} value={item.id}>
              {item.groupName}
            </Option>
          ))}
        </Select>

        
            <Search
              placeholder="请输入学生姓名/昵称/学号进行搜索"
              onSearch={handleSearch}
              allowClear
            />

        </div>
        
      </div>

      <div className="table-container">
        <Spin spinning={loading}>
          <Table<Student>
            columns={tableColumns}
            dataSource={studentInfo}
            rowKey="memberId"
            pagination={false}
            locale={{
              emptyText: <Empty description="暂无数据" />
            }}
          />
        </Spin>
      </div>

      {pagination.totlePageCount > 1 && (
        <div className="pagination-container">
          <Pagination
            current={pagination.pageIndex}
            total={pagination.totalCount}
            pageSize={20}
            onChange={handlePageChange}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
          />
        </div>
      )}

      {/* 学生分组模态框 */}
      <Modal
        title="学生分组"
        open={groupModalVisible}
        onOk={handleFullGroup}
        onCancel={() => setGroupModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <div className="group-modal">
          <p>
            每组人数：
            <InputNumber
              min={2}
              max={totalNum}
              value={groupMemberNumber}
              onChange={(value) => setGroupMemberNumber(value || 0)}
            />
          </p>
          <p className="tips">
            当前课堂共{totalNum}人，请填写每组人数，系统将随机按照每组人数将全班分为若干个组。
          </p>
        </div>
      </Modal>

      {/* 新建小组模态框 */}
      <Modal
        title="新建小组"
        open={newGroupModalVisible}
        onOk={handleNewGroup}
        onCancel={() => {
          setNewGroupModalVisible(false);
          setNewGroupName('');
        }}
        okText="确定"
        cancelText="取消"
      >
        <Input
          placeholder="请输入小组名称"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
      </Modal>

      {/* 清空小组确认模态框 */}
      <Modal
        title="确定清空小组吗？"
        open={clearGroupModalVisible}
        onOk={handleClearGroup}
        onCancel={() => setClearGroupModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>当前所有分组将被删除</p>
      </Modal>

      {/* 解散小组确认模态框 */}
      <Modal
        title="确定解散小组吗？"
        open={disbandGroupModalVisible}
        onOk={handleDisbandGroup}
        onCancel={() => setDisbandGroupModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>解散后该组学生将进入未分组状态</p>
      </Modal>

      {/* 移动组员模态框 */}
      <Modal
        title="移动组员"
        open={moveGroupModalVisible}
        onOk={handleMoveGroupConfirm}
        onCancel={() => {
          setMoveGroupModalVisible(false);
          setMovetoGroupId('');
        }}
        okText="确定"
        cancelText="取消"
      >
        <Radio.Group 
          value={movetoGroupId} 
          onChange={(e) => setMovetoGroupId(e.target.value)}
        >
          <Space direction="vertical">
            <Radio value="-1">未分组</Radio>
            {groupNameList.map(group => (
              <Radio 
                key={group.id} 
                value={group.id}
                disabled={group.id === groupId}
              >
                {group.groupName}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default StudentManagement;