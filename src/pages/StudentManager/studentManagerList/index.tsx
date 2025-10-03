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
  DeleteOutlined,
  SwapOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import * as XLSX from 'xlsx';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

const { Search } = Input;
const { Option } = Select;

// 类型定义
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
  // 状态管理（保持不变）
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [studentInfo, setStudentInfo] = useState<Student[]>([]);
  const [students, setStudents] = useState<Student[]>([
    {
      memberId: '1',
      nickName: '张三同学',
      realName: '张三',
      verifyStatus: true,
      number: '2021001',
      groupId: 'group-1',
      groupName: '第一组',
    },
    {
      memberId: '2',
      nickName: '李四学长',
      realName: '李四',
      verifyStatus: false,
      number: '2021002',
      groupId: 'group-1',
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
      groupId: 'group-2',
      groupName: '第二组',
    },
  ]);
  
  const [groups, setGroups] = useState<Group[]>([
    { id: 'group-1', groupName: '第一组' },
    { id: 'group-2', groupName: '第二组' },
  ]);
  
  const [groupIdCounter, setGroupIdCounter] = useState(() => {
    const maxId = groups.reduce((max, group) => {
      const num = parseInt(group.id.replace('group-', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    return maxId + 1;
  });

  // 其他状态（保持不变）
  const [groupId, setGroupId] = useState<string | null>(null);
  const [totalNum, setTotalNum] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [sortType, setSortType] = useState('');
  const [order, setOrder] = useState<number>(ORDER.UP);
  const [checkedMemberIdList, setCheckedMemberIdList] = useState<string[]>([]);
  const [checkedAllState, setCheckedAllState] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    pageIndex: 1,
    totalCount: 10,
    totlePageCount: 10,
  });

  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
  const [clearGroupModalVisible, setClearGroupModalVisible] = useState(false);
  const [disbandGroupModalVisible, setDisbandGroupModalVisible] = useState(false);
  const [moveGroupModalVisible, setMoveGroupModalVisible] = useState(false);
  
  const [groupMemberNumber, setGroupMemberNumber] = useState<number>(2);
  const [newGroupName, setNewGroupName] = useState('');
  const [movetoGroupId, setMovetoGroupId] = useState<string>('');
  const [groupNameList, setGroupNameList] = useState<Group[]>([]);

  // 获取学生列表（保持不变）
  const getStuManageList = useCallback(async (params: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...students];
      
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
      
      // 排序逻辑
      if (params.sortType) {
        filteredData.sort((a, b) => {
          if (params.sortType === SORT_TYPE.NUMBER) {
            const numA = parseInt(a.number);
            const numB = parseInt(b.number);
            return params.order === ORDER.UP ? numA - numB : numB - numA;
          }
          return 0;
        });
      }
      
      setStudentInfo(filteredData);
      setTotalNum(filteredData.length);
      // setPagination({
      //   pageIndex: params.pageIndex || 1,
      //   totalCount: filteredData.length,
      //   totlePageCount: Math.ceil(filteredData.length / (params.pageSize || 20)),
      // });
    } catch (error) {
      console.error('获取学生列表失败', error);
    } finally {
      setLoading(false);
    }
  }, [students]);

  // 新增：导出Excel功能
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    
    try {
      // 准备导出数据 - 转换为更易读的格式
      const exportData = studentInfo.map(student => ({
        '用户昵称': student.nickName,
        '姓名': student.realName,
        '学号': student.number,
        '本校认证状态': student.verifyStatus ? '已认证' : '未认证',
        '分组': student.groupName || '未分组'
      }));
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '学生列表');
      
      // 生成文件名（包含当前日期）
      const date = new Date();
      const fileName = `学生列表_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}.xlsx`;
      
      // 导出文件
      XLSX.writeFile(workbook, fileName);
      
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败', error);
      message.error('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  // 其他方法保持不变...
  const getGroupList = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setGroupNameList(groups);
    } catch (error) {
      console.error('获取分组列表失败', error);
    }
  }, [groups]);

  useEffect(() => {
    getGroupList();
    getStuManageList({ pageIndex: 1, pageSize: 20, classroomId: classId });
  }, [classId, getStuManageList, getGroupList]);

  const hasCountGroup = groups.length > 0;

  const getSortClass = (sortTypeParam: string) => {
    if (sortTypeParam !== sortType) {
      return 'default';
    }
    return order === ORDER.UP ? 'up' : 'down';
  };

  const isShowSpocOnline = () => {
    return (
      (window as any).courseDto?.productType !== '4' &&
      ['10', '15', '20'].indexOf((window as any).courseDto?.mode) > -1
    );
  };

  const handleKickout = (student: Student) => {
    const name = student.realName ? `${student.nickName}_${student.realName}` : student.nickName;
    Modal.confirm({
      title: '确认操作',
      content: `确认将${name}从课堂中踢出？`,
      onOk: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setStudents(prev => prev.filter(s => s.memberId !== student.memberId));
          setCheckedMemberIdList(prev => prev.filter(id => id !== student.memberId));
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

  const handleFullGroup = async () => {
    const totalStudents = students.length;
    if (groupMemberNumber > totalStudents) {
      message.error('分组人数不能大于当前课堂人数!');
      return;
    }
    if (groupMemberNumber <= 1 || groupMemberNumber >= totalStudents) {
      message.error('每组人数需大于1且小于课堂总人数!');
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
      const groupCount = Math.ceil(totalStudents / groupMemberNumber);
      const newGroups: Group[] = [];
      for (let i = 0; i < groupCount; i++) {
        newGroups.push({
          id: new Date().getTime() + i,
          groupName: `第${i + 1}组`,
        });
      }
      
      const groupedStudents = shuffledStudents.map((student, index) => {
        const groupIndex = Math.floor(index / groupMemberNumber);
        const group = newGroups[groupIndex];
        return {
          ...student,
          groupId: group.id,
          groupName: group.groupName,
        };
      });
      
      setGroups(newGroups);
      setStudents(groupedStudents);
      console.log('分组结果:', newGroups);
      
      message.success('分组成功');
      setGroupModalVisible(false);
      resetTable();
    } catch (error) {
      message.error('分组失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNewGroup = async () => {
    const groupName = newGroupName.trim() || '新分组';
    const isDuplicate = groups.some(g => g.groupName === groupName);
    if (isDuplicate) {
      message.error('该分组名称已存在，请更换名称！');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newGroup: Group = {
        id: new Date().getTime() ,
        groupName,
      };
      setGroups(prev => [...prev, newGroup]);
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
      setGroups([]);
      setStudents(prev => prev.map(student => ({
        ...student,
        groupId: undefined,
        groupName: '未分组',
      })));
      setGroupIdCounter(1);
      setGroupId(null);
      message.success('清空分组成功');
      setClearGroupModalVisible(false);
      resetTable();
    } catch (error) {
      message.error('清空分组失败');
    }
  };

  const handleDisbandGroup = async () => {
    if (!groupId) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setGroups(prev => prev.filter(g => g.id !== groupId));
      setStudents(prev => prev.map(student => 
        student.groupId === groupId 
          ? { ...student, groupId: undefined, groupName: '未分组' }
          : student
      ));
      message.success('解散小组成功');
      setDisbandGroupModalVisible(false);
      resetTable();
    } catch (error) {
      message.error('解散小组失败');
    }
  };

  const handleMoveGroupConfirm = async () => {
    if (!checkedMemberIdList.length) {
      message.warning('请先选择需要移动的学生！');
      return;
    }
    if (movetoGroupId === groupId) {
      message.error('不能移动到同一组！');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let targetGroupName = '未分组';
      if (movetoGroupId !== '-1') {
        const targetGroup = groups.find(g => g.id === movetoGroupId);
        if (targetGroup) targetGroupName = targetGroup.groupName;
      }

      setStudents(prev => prev.map(student => 
        checkedMemberIdList.includes(student.memberId)
          ? {
              ...student,
              groupId: movetoGroupId === '-1' ? undefined : movetoGroupId,
              groupName: targetGroupName,
            }
          : student
      ));

      message.success('移动成功');
      setMoveGroupModalVisible(false);
      setMovetoGroupId('');
      setCheckedMemberIdList([]);
      resetTable();
    } catch (error) {
      message.error('移动失败');
    }
  };

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
      sortType: sortTypeParam,
      order: newOrder,
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
    setCheckedAllState(newCheckedList.length === studentInfo.length && studentInfo.length > 0);
  };

  const showGroupModal = () => {
    if (students.length <= 2) {
      message.warning('当前课堂人数大于2人才可以进行随机分组');
      return;
    }
    setGroupModalVisible(true);
  };

  const handleMoveGroup = () => {
    if (!checkedMemberIdList.length) {
      message.warning('请先选择需要移动的学生！');
      return;
    }
    setMoveGroupModalVisible(true);
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

  // 表格列配置（保持不变）
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
          <span 
            className={`sort-icon ${getSortClass(SORT_TYPE.NUMBER)}`}
            onClick={() => handleSort(SORT_TYPE.NUMBER)}
          >
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
        <a 
          className='kitButton' 
          onClick={() => handleKickout(record)}
        >
          踢出课堂
        </a>
      ),
    },
  ];

  return (
    <div className="u-stu-manage-container">
      <div className="totalNum">总人数: {totalNum} 人</div>

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
        <div style={{display: 'flex', gap: 12}}>
          <Select
            value={groupId || ''}
            onChange={handleGroupFilterChange}
            style={{ 
              visibility: groupNameList.length === 0 ? 'hidden' : 'visible',
              width: 160
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
            style={{ width: 310 }}
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
          <Pagination
            current={pagination.pageIndex}
            total={pagination.totalCount}
            align='center'
            pageSize={20}
            onChange={handlePageChange}
           
          />
      )}

      {/* 所有模态框保持不变 */}
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
              max={students.length}
              value={groupMemberNumber}
              onChange={(value) => setGroupMemberNumber(value || 2)}
              style={{ marginLeft: 8 }}
            />
          </p>
          <p className="tips">
            当前课堂共{students.length}人，请填写每组人数，系统将随机按照每组人数将全班分为若干个组。
          </p>
        </div>
      </Modal>

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

      <Modal
        title="确定清空小组吗？"
        open={clearGroupModalVisible}
        onOk={handleClearGroup}
        onCancel={() => setClearGroupModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>当前所有分组将被删除，学生将恢复为“未分组”状态</p>
      </Modal>

      <Modal
        title="确定解散小组吗？"
        open={disbandGroupModalVisible}
        onOk={handleDisbandGroup}
        onCancel={() => setDisbandGroupModalVisible(false)}
        okText="确定"
        cancelText="取消"
      >
        <p>解散后该组学生将进入“未分组”状态</p>
      </Modal>

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
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Radio value="-1">未分组</Radio>
          {groups.map(group => (
            <Radio 
              key={group.id} 
              value={group.id}
              disabled={group.id === groupId}
            >
              {group.groupName}
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default StudentManagement;
    