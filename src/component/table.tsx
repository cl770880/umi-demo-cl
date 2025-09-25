import React, { useRef } from 'react';
import {
  Table,
  Select,
  Button,
  Input,
  Pagination,
  Empty,
  Typography,
  Space,
  Row,
  Col,
  Tag
} from 'antd';
import {
  DownloadOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined
} from '@ant-design/icons';
import type {
  TableProps,
  SelectProps,
  InputSearchProps,
  PaginationProps
} from 'antd';

// ========================== 类型定义 ==========================
/** 排序字段枚举（对应原 sortConst） */
export enum SortField {
  NUMBER = 'number', // 学号
  SIGNIN = 'signin', // 出勤
  PAPER = 'paper', // 练习
  FORUM = 'forum', // 讨论
  GRADE = 'grade' // 成绩
}

/** 分组选项类型 */
export interface GroupItem {
  id: string | number;
  groupName: string;
}

/** 学生信息类型 */
export interface StudentItem {
  nickName: string;
  realName?: string;
  number?: string;
  groupName?: string;
  // 出勤相关
  signCount: number; // 出勤次数
  // 点名相关
  rollcallCount: number; // 点名次数（已应答）
  // 练习相关
  practiceDone: number; // 已做题数
  practiceCorrect?: number; // 正确题数（可选）
  // 讨论相关
  postCount: number; // 讨论发帖数
  // 视频相关（线上课）
  videoCount?: number; // 视频观看个数
  videoTimes?: number; // 视频观看次数
  videoDuration?: string; // 视频观看时长（如 "120min"）
  // 讨论区相关（线上课）
  forumTopic?: number; // 讨论区主题数
  forumComment?: number; // 讨论区评论数
  forumReply?: number; // 讨论区回复数
  // 成绩相关（线上课）
  syncScore?: number; // 同步成绩（mode=10时用）
  sourceScore?: number; // 源成绩（mode=10时用）
  totalScore?: number; // 总线上成绩
}

/** 组件Props类型 */
export interface StudentManageProps {
  /** 是否为开放资源课程 */
  isClassroomOpenResource: boolean;
  /** 分组列表 */
  groupNameList: GroupItem[];
  /** 学生列表 */
  studentList?: StudentItem[];
  /** 是否仅线下课堂（仅线下时不显示线上相关列） */
  onlyOfflineClass: boolean;
  /** 课程模式（用于格式化成绩标题） */
  mode: number;
  /** 总出勤次数 */
  classSiginTotal: number;
  /** 总点名次数 */
  rollCallTotal: number;
  /** 总练习题数 */
  praticeTotal: number;
  /** 总讨论数 */
  classroomPostTotal?: number;
  /** 学期ID（用于查看成绩链接） */
  termId: string | number;
  /** 线上学期ID（用于查看成绩链接） */
  linkOnlineTermId: string | number;
  /** 总数据条数（分页用） */
  total: number;
  /** 当前页码（分页用） */
  currentPage: number;
  /** 当前排序字段 */
  sortField?: SortField;
  /** 当前排序方向 */
  sortOrder?: 'ascend' | 'descend' | null;
  /** 是否为SPOC课程（用于区分成绩查看链接） */
  isSpoc: boolean;
  /** 搜索事件 */
  onSearch: (value: string) => void;
  /** 排序事件 */
  onSort: (field: SortField) => void;
  /** 分页切换事件 */
  onPageChange: (page: number) => void;
  /** 导出事件 */
  onExport: () => void;
  /** 是否显示成绩查看按钮 */
  showStuBtn: () => boolean;
  /** 格式化学习表现标题（对应原 formatStudyPerformance） */
  formatStudyPerformance: (mode: number) => string;
}

// ========================== 组件实现 ==========================
const StudentManage: React.FC<StudentManageProps> = (props) => {
  const {
    isClassroomOpenResource,
    groupNameList,
    studentList,
    onlyOfflineClass,
    mode,
    classSiginTotal,
    rollCallTotal,
    praticeTotal,
    classroomPostTotal,
    termId,
    linkOnlineTermId,
    total,
    currentPage,
    sortField,
    sortOrder,
    isSpoc,
    onSearch,
    onSort,
    onPageChange,
    onExport,
    showStuBtn,
    formatStudyPerformance
  } = props;

  // 组件Ref
  const groupFilterRef = useRef<SelectProps<GroupItem['id']>['ref']>(null);
  const exportBtnRef = useRef<HTMLDivElement>(null);
  const pagerRef = useRef<PaginationProps['ref']>(null);

  // ========================== 格式化函数 ==========================
  /** 格式化出勤显示（对应原 formatShowSign） */
  const formatShowSign = (signCount: number) => {
    return `${signCount}/${classSiginTotal}`;
  };

  /** 格式化点名显示（对应原 rollcall） */
  const formatRollcall = (rollcallCount: number) => {
    return `${rollcallCount}/${rollCallTotal}`;
  };

  /** 格式化练习显示（对应原 formatShowPractice） */
  const formatShowPractice = (practiceDone: number, practiceCorrect?: number) => {
    const correctText = practiceCorrect ? `(正确${practiceCorrect}题)` : '';
    return `${practiceDone}/${praticeTotal}题 ${correctText}`;
  };

  /** 格式化讨论显示（对应原 formatShowPost） */
  const formatShowPost = (postCount: number) => {
    return `${postCount}/${classroomPostTotal || 0}个`;
  };

  /** 格式化视频显示（对应原 formatShowTime） */
  const formatShowTime = (
    videoCount?: number,
    videoTimes?: number,
    videoDuration?: string
  ) => {
    return `${videoCount || 0}/${videoTimes || 0}/${videoDuration || '0min'}`;
  };

  /** 格式化讨论区显示（对应原 formatForum） */
  const formatForum = (
    forumTopic?: number,
    forumComment?: number,
    forumReply?: number
  ) => {
    return `${forumTopic || 0}/${forumComment || 0}/${forumReply || 0}`;
  };

  /** 格式化成绩显示（对应原 formatShowScore） */
  const formatShowScore = (
    syncScore?: number,
    sourceScore?: number,
    totalScore?: number
  ) => {
    if (mode === 10) {
      return `${totalScore || 0}分 (同步:${syncScore || 0} + 源:${sourceScore || 0})`;
    }
    return `${totalScore || 0}分`;
  };

  /** 构建表格列配置（核心） */
  const buildTableColumns = (): TableProps<StudentItem>['columns'] => {
    // 基础列：学生基本信息
    const baseColumns = [
      {
        title: '学生昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        width: 120,
        align: 'center'
      },
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName',
        width: 100,
        align: 'center',
        render: (realName?: string) => realName || '-'
      },
      {
        title: (
          <Space>
            学号
            <Button
              size="mini"
              icon={
                sortOrder === 'ascend' && sortField === SortField.NUMBER ? (
                  <SortAscendingOutlined />
                ) : sortOrder === 'descend' && sortField === SortField.NUMBER ? (
                  <SortDescendingOutlined />
                ) : null
              }
              onClick={() => onSort(SortField.NUMBER)}
              type="text"
            />
          </Space>
        ),
        dataIndex: 'number',
        key: 'number',
        width: 120,
        align: 'center',
        render: (number?: string) => number || '-',
        sorter: true,
        sortOrder: sortField === SortField.NUMBER ? sortOrder : null
      }
    ];

    // 分组列（仅当有分组列表时显示）
    if (groupNameList.length > 0) {
      baseColumns.push({
        title: '分组',
        dataIndex: 'groupName',
        key: 'groupName',
        width: 120,
        align: 'center',
        render: (groupName?: string) => groupName || '-'
      });
    }

    // 课堂学习表现列
    const studyColumns = [
      {
        title: (
          <Space>
            出勤情况/{classSiginTotal}次
            <Button
              size="mini"
              icon={
                sortOrder === 'ascend' && sortField === SortField.SIGNIN ? (
                  <SortAscendingOutlined />
                ) : sortOrder === 'descend' && sortField === SortField.SIGNIN ? (
                  <SortDescendingOutlined />
                ) : null
              }
              onClick={() => onSort(SortField.SIGNIN)}
              type="text"
            />
          </Space>
        ),
        key: 'signin',
        width: 160,
        align: 'center',
        render: (_: any, record: StudentItem) =>
          formatShowSign(record.signCount),
        sorter: true,
        sortOrder: sortField === SortField.SIGNIN ? sortOrder : null
      },
      {
        title: `点名/${rollCallTotal}次`,
        key: 'rollcall',
        width: 120,
        align: 'center',
        render: (_: any, record: StudentItem) =>
          formatRollcall(record.rollcallCount)
      },
      {
        title: (
          <Space>
            练习/{praticeTotal}题
            <Button
              size="mini"
              icon={
                sortOrder === 'ascend' && sortField === SortField.PAPER ? (
                  <SortAscendingOutlined />
                ) : sortOrder === 'descend' && sortField === SortField.PAPER ? (
                  <SortDescendingOutlined />
                ) : null
              }
              onClick={() => onSort(SortField.PAPER)}
              type="text"
            />
          </Space>
        ),
        key: 'paper',
        width: 160,
        align: 'center',
        render: (_: any, record: StudentItem) =>
          formatShowPractice(record.practiceDone, record.practiceCorrect),
        sorter: true,
        sortOrder: sortField === SortField.PAPER ? sortOrder : null
      },
      {
        title: (
          <Space>
            讨论/{classroomPostTotal || 0}个
            <Button
              size="mini"
              icon={
                sortOrder === 'ascend' && sortField === SortField.FORUM ? (
                  <SortAscendingOutlined />
                ) : sortOrder === 'descend' && sortField === SortField.FORUM ? (
                  <SortDescendingOutlined />
                ) : null
              }
              onClick={() => onSort(SortField.FORUM)}
              type="text"
            />
          </Space>
        ),
        key: 'forum',
        width: 160,
        align: 'center',
        render: (_: any, record: StudentItem) =>
          formatShowPost(record.postCount),
        sorter: true,
        sortOrder: sortField === SortField.FORUM ? sortOrder : null
      }
    ];

    // 线上学习相关列（仅当非纯线下课且为开放资源课程时显示）
    const onlineColumns: TableProps<StudentItem>['columns'] = [];
    if (!onlyOfflineClass && isClassroomOpenResource) {
      onlineColumns.push(
        {
          title: '视频观看个数/次数/时长',
          key: 'video',
          width: 220,
          align: 'center',
          render: (_: any, record: StudentItem) =>
            formatShowTime(record.videoCount, record.videoTimes, record.videoDuration)
        },
        {
          title: '讨论区主题数/评论数/回复数',
          key: 'forumNumber',
          width: 220,
          align: 'center',
          render: (_: any, record: StudentItem) =>
            formatForum(record.forumTopic, record.forumComment, record.forumReply)
        },
        {
          title: (
            <Space>
              {mode === 10
                ? '线上成绩/100分(同步成绩+源成绩)'
                : '线上成绩/100分'}
              <Button
                size="mini"
                icon={
                  sortOrder === 'ascend' && sortField === SortField.GRADE ? (
                    <SortAscendingOutlined />
                  ) : sortOrder === 'descend' && sortField === SortField.GRADE ? (
                    <SortDescendingOutlined />
                  ) : null
                }
                onClick={() => onSort(SortField.GRADE)}
                type="text"
              />
            </Space>
          ),
          key: 'grade',
          width: 240,
          align: 'center',
          render: (_: any, record: StudentItem) => (
            <Space>
              {formatShowScore(
                record.syncScore,
                record.sourceScore,
                record.totalScore
              )}
              {showStuBtn() && (
                <Typography.Link
                  target="_blank"
                  href={isSpoc
                    ? `//www.icourse163.org/collegeAdmin/moocTermManage/${termId}.htm#/tp/studentReport?studentName=${encodeURIComponent(
                        record.nickName
                      )}`
                    : `//www.icourse163.org/collegeAdmin/moocTermManage/${linkOnlineTermId}.htm#/tp/manageStudent?studentName=${encodeURIComponent(
                        record.nickName
                      )}`}
                >
                  查看
                </Typography.Link>
              )}
            </Space>
          ),
          sorter: true,
          sortOrder: sortField === SortField.GRADE ? sortOrder : null
        }
      );
    }

    // 合并所有列（处理复杂表头分组）
    return [
      {
        title: '学生基本信息',
        key: 'base',
        align: 'center',
        children: baseColumns,
        colSpan: baseColumns.length
      },
      {
        title: '课堂学习表现',
        key: 'study',
        align: 'center',
        children: studyColumns,
        colSpan: studyColumns.length
      },
      ...(onlineColumns.length > 0
        ? [
            {
              title: formatStudyPerformance(mode),
              key: 'online',
              align: 'center',
              children: onlineColumns,
              colSpan: onlineColumns.length
            }
          ]
        : [])
    ];
  };

  // 表格列配置
  const columns = buildTableColumns();

  // ========================== 渲染逻辑 ==========================
  return (
    <div className="student-manage-container" style={{ width: '100%' }}>
      {/* 顶部提示信息 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        {/* 开放资源课程提示（条件显示） */}
        {!isClassroomOpenResource && (
          <Typography.Text style={{ lineHeight: '37px' }}>
            开放资源课程暂不支持查看线上课成绩相关数据，如需查看请点击
            <Typography.Link
              target="_blank"
              href="https://www.wjx.cn/jq/89879943.aspx"
              style={{ margin: '0 4px' }}
            >
              【申请查看】
            </Typography.Link>
            填写您的信息，我们将主动联系贵校相关负责人
          </Typography.Text>
        )}
        {/* 数据更新提示 */}
        <Typography.Text style={{ lineHeight: '37px', fontSize: 12, color: '#666' }}>
          学生的出勤情况，点名，视频学习相关数据隔天更新
        </Typography.Text>
      </div>

      {/* 学生管理操作区（分组筛选 + 搜索 + 导出） */}
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        {/* 分组筛选（条件显示） */}
        {groupNameList.length > 0 && (
          <Col>
            <Select
              ref={groupFilterRef}
              placeholder="全部"
              style={{ width: 180 }}
              allowClear
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="-1">未分组</Select.Option>
              {groupNameList.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.groupName}
                </Select.Option>
              ))}
            </Select>
          </Col>
        )}

        {/* 右侧：搜索 + 导出 */}
        <Col style={{ marginLeft: 'auto' }}>
          <Space size="middle">
            {/* 搜索框 */}
            <Input.Search
              placeholder="请输入学生名称/昵称/学号进行搜索"
              onSearch={onSearch}
              style={{ width: 300 }}
              enterButton
            />
            {/* 导出按钮 */}
            <div ref={exportBtnRef}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={onExport}
              >
                导出
              </Button>
            </div>
          </Space>
        </Col>
      </Row>

      {/* 学生表格 */}
      <Table<StudentItem>
        columns={columns}
        dataSource={studentList || []}
        rowKey="number" // 用学号作为唯一key（无学号时可考虑其他唯一标识）
        loading={studentList === undefined} // 加载中状态（studentList未定义时）
        pagination={false} // 关闭内置分页，使用外部分页组件
        locale={{ emptyText: <Empty description="暂无学习表现" /> }} // 空数据提示
        bordered // 显示边框（与原样式保持一致）
        scroll={{ x: 'max-content' }} // 横向滚动（适配多列场景）
      />

      {/* 分页组件（仅当总条数>1时显示） */}
      {total > 1 && (
        <div
          className="pager-wrapper"
          style={{ marginTop: 16, textAlign: 'right' }}
        >
          <Pagination
            ref={pagerRef}
            current={currentPage}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false} // 不显示每页条数切换（原逻辑无此功能）
            showQuickJumper
            showTotal={(total) => `共 ${total} 条记录`}
            size="middle"
          />
        </div>
      )}
    </div>
  );
};

export default StudentManage;