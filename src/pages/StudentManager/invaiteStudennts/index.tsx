import React, { useState, useEffect, useCallback } from 'react';
import {
  Input,
  Button,
  Table,
  Pagination,
  Empty,
  message,
  Tabs,
  Space,
  Typography,
} from 'antd';
import { 
  MailOutlined, 
  SendOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { TextArea } = Input;

// 类型定义
interface InviteRecord {
  id: string;
  inviteSource: string; // 邀请来源
  studentId: string; // 学号
  studentName: string; // 姓名
  inviteStatus: string; // 邀请状态
}

interface InviteStudentProps {
  termId?: string;
  classId?: string;
}

const PAGE_SIZE = 10;

const InviteStudentSimple: React.FC<InviteStudentProps> = ({ termId, classId }) => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [inviteList, setInviteList] = useState<InviteRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(9); // 根据图片显示有9页

  // Mock数据
  const mockInviteData: InviteRecord[] = Array.from({ length: 8 }, (_, index) => ({
    id: `invite_${index + 1}`,
    inviteSource: '直接邀请',
    studentId: '137415352',
    studentName: '赵竹林',
    inviteStatus: '等待学生认证',
  }));

  // 发送邀请邮件
  const handleSendInvite = async () => {
    if (!emailInput.trim()) {
      message.warning('请输入学号');
      return;
    }

    // 检查是否包含中文字符
    if (/[^\x00-\xff]/.test(emailInput)) {
      message.error('请将输入法由中文切换为英文');
      return;
    }

    setSending(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('发送成功');
      setEmailInput('');
      // 重新加载列表
      loadInviteList();
    } catch (error) {
      message.error('发送失败');
    } finally {
      setSending(false);
    }
  };

  // 加载邀请列表
  const loadInviteList = useCallback(() => {
    setLoading(true);
    // 模拟加载延迟
    setTimeout(() => {
      setInviteList(mockInviteData);
      setLoading(false);
    }, 500);
  }, []);

  // 中断邀请
  const handleBreakInvite = async (record: InviteRecord) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success('中断邀请成功');
      loadInviteList();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 在实际项目中这里会调用API加载对应页数据
  };

  // 定义表格列
  const columns: ColumnsType<InviteRecord> = [
    {
      title: '邀请来源',
      dataIndex: 'inviteSource',
      key: 'inviteSource',
      width: 120,
      align: 'center',
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 100,
      align: 'center',
    },
    {
      title: '邀请状态',
      dataIndex: 'inviteStatus',
      key: 'inviteStatus',
      width: 120,
      align: 'center',
      render: (status: string) => (
        <span >{status}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => handleBreakInvite(record)}
          style={{ color: '#00cc7e', padding: 0 }}
        >
          中断邀请
        </Button>
      ),
    },
  ];

  // 初始化数据
  useEffect(() => {
    loadInviteList();
  }, [loadInviteList]);

  return (
    <div className="invite-student-simple">
      
          <div className="tab-content">
            <Paragraph className="intro-text">
              对于已完成认证的本校学生，可以通过直接输入学生学号帮助其直接加入课程。
            </Paragraph>
            
            <div className="input-section">
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="请输入学号"
                  style={{ width: 300 }}
                />
                <Button
                  type="primary"
                  loading={sending}
                  onClick={handleSendInvite}
                  className="send-button"
                >
                  直接添加
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  className="batch-button"
                >
                  批量邀请
                </Button>
              </Space.Compact>
            </div>

            <div className="invite-list-section">
              <h2 className="section-title">邀请未完成列表</h2>
              <Paragraph className="section-desc">
                显示邀请进行中的学生列表，待其认证成功后，将自动加入课程，列表中将不再显示邀请成功的学生。
              </Paragraph>

              <Table
                columns={columns}
                dataSource={inviteList}
                loading={loading}
                pagination={false}
                rowKey="id"
                size="middle"
                locale={{
                  emptyText: <Empty description="暂无数据" />
                }}
               
              />

              <div className="pagination-wrapper">
                <Pagination
                  current={currentPage}
                  total={totalPages * PAGE_SIZE}
                  pageSize={PAGE_SIZE}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  size="small"
                />
              </div>
            </div>
          </div>

    </div>
  );
};

export default InviteStudentSimple;