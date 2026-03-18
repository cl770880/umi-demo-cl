import React, { useRef, useState } from 'react';
import { ProTable, ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, DatePicker, Input, message } from 'antd';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import './index.css';

const { RangePicker } = DatePicker;

// 订单数据类型定义
interface OrderItem {
  orderId: string;
  createTime: string;
  productName: string;
  payAmount: number;
  payChannel: string;
  buyer: string;
  buyerPhone: string;
}

// 支付渠道映射
const PAY_CHANNEL_MAP: Record<string, string> = {
  wechat: '微信',
  alipay: '支付宝',
  apple: '苹果支付',
};

// 生成模拟订单数据
const generateMockOrders = (count: number): OrderItem[] => {
  const products = ['连续包月', '连续包年', '月卡', '季卡', '年卡'];
  const payChannels = ['wechat', 'alipay', 'apple'];
  const orders: OrderItem[] = [];

  for (let i = 0; i < count; i++) {
    const orderId = `${121210 + i}`;
    const createTime = dayjs()
      .subtract(Math.floor(Math.random() * 30), 'day')
      .subtract(Math.floor(Math.random() * 24), 'hour')
      .format('YYYY-MM-DD HH:mm:ss');
    const productName = products[Math.floor(Math.random() * products.length)];
    const payAmount = 357.0;
    const payChannel = payChannels[Math.floor(Math.random() * payChannels.length)];
    const buyer = `用户昵称_15999684445`;
    const buyerPhone = '15999684445';

    orders.push({
      orderId,
      createTime,
      productName,
      payAmount,
      payChannel,
      buyer,
      buyerPhone,
    });
  }

  return orders;
};

// 模拟数据源
const mockOrderData = generateMockOrders(100);

const OrderManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [exporting, setExporting] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    orderId?: string;
    productName?: string;
    dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
    timeType?: 'week' | 'month' | 'year';
  }>({});

  // 定义表格列
  const columns: ProColumns<OrderItem>[] = [
    {
      title: '订单ID',
      dataIndex: 'orderId',
      width: 120,
      align: 'center',
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      width: 180,
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 150,
      align: 'center',
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      width: 120,
      align: 'center',
      render: (_, record) => record.payAmount.toFixed(2),
    },
    {
      title: '支付渠道',
      dataIndex: 'payChannel',
      width: 120,
      align: 'center',
      render: (_, record) => PAY_CHANNEL_MAP[record.payChannel] || record.payChannel,
    },
    {
      title: '买家',
      dataIndex: 'buyer',
      width: 200,
      align: 'center',
    },
  ];

  // 模拟异步数据请求
  const fetchData = async (params: any): Promise<{ data: OrderItem[]; total: number }> => {
    // 模拟延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredData = [...mockOrderData];

    // 根据搜索条件过滤数据
    if (searchParams.orderId) {
      filteredData = filteredData.filter((item) =>
        item.orderId.includes(searchParams.orderId!)
      );
    }

    if (searchParams.productName) {
      filteredData = filteredData.filter((item) =>
        item.productName.includes(searchParams.productName!)
      );
    }

    if (searchParams.dateRange) {
      const [start, end] = searchParams.dateRange;
      filteredData = filteredData.filter((item) => {
        const itemDate = dayjs(item.createTime);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }

    if (searchParams.timeType) {
      const now = dayjs();
      let startDate = now;
      if (searchParams.timeType === 'week') {
        startDate = now.subtract(7, 'day');
      } else if (searchParams.timeType === 'month') {
        startDate = now.subtract(1, 'month');
      } else if (searchParams.timeType === 'year') {
        startDate = now.subtract(1, 'year');
      }
      filteredData = filteredData.filter((item) => {
        const itemDate = dayjs(item.createTime);
        return itemDate.isAfter(startDate);
      });
    }

    // 分页处理
    const { current = 1, pageSize = 10 } = params;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filteredData.slice(start, end),
      total: filteredData.length,
    };
  };

  // 导出Excel功能
  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      // 获取当前筛选后的所有数据
      const { data } = await fetchData({ current: 1, pageSize: mockOrderData.length });

      // 准备导出数据
      const exportData = data.map((item) => ({
        订单ID: item.orderId,
        下单时间: item.createTime,
        商品名称: item.productName,
        实付金额: item.payAmount.toFixed(2),
        支付渠道: PAY_CHANNEL_MAP[item.payChannel as keyof typeof PAY_CHANNEL_MAP],
        买家: item.buyer,
        联系电话: item.buyerPhone,
      }));

      // 创建工作簿
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '订单列表');

      // 生成文件名
      const fileName = `订单管理_${dayjs().format('YYYYMMDD')}.xlsx`;

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

  // 计算交易总额
  const calculateTotalAmount = () => {
    const total = mockOrderData.reduce((sum, item) => sum + item.payAmount, 0);
    return total.toFixed(2);
  };

  return (
    <div className="order-management-container">
      <div className="page-title">订单管理</div>

      <div className="filter-section">
        <div className="left-section">
          <span className="total-label">交易总额：</span>
          <div className="total-amount">{calculateTotalAmount()}</div>
        </div>

        <div className="right-section">
          <Space size="small">
            <span>ID:</span>
            <Input
              placeholder="请输入商品id"
              style={{ width: 120 }}
              onChange={(e) =>
                setSearchParams({ ...searchParams, orderId: e.target.value })
              }
              allowClear
              size="middle"
            />

            <span>商品名</span>
            <Input
              placeholder="请输入商品名"
              style={{ width: 120 }}
              onChange={(e) =>
                setSearchParams({ ...searchParams, productName: e.target.value })
              }
              allowClear
              size="middle"
            />

            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.reload();
              }}
            >
              查询
            </Button>

            <Button
              type="text"
              className={searchParams.timeType === 'week' ? 'time-btn-active' : 'time-btn'}
              onClick={() => {
                setSearchParams({ ...searchParams, timeType: 'week' });
                actionRef.current?.reload();
              }}
            >
              本周
            </Button>
            <Button
              type="text"
              className={searchParams.timeType === 'month' ? 'time-btn-active' : 'time-btn'}
              onClick={() => {
                setSearchParams({ ...searchParams, timeType: 'month' });
                actionRef.current?.reload();
              }}
            >
              本月
            </Button>
            <Button
              type="text"
              className={searchParams.timeType === 'year' ? 'time-btn-active' : 'time-btn'}
              onClick={() => {
                setSearchParams({ ...searchParams, timeType: 'year' });
                actionRef.current?.reload();
              }}
            >
              全年
            </Button>

            <RangePicker
              style={{ width: 240 }}
              onChange={(dates) =>
                setSearchParams({
                  ...searchParams,
                  dateRange: dates as [dayjs.Dayjs, dayjs.Dayjs],
                })
              }
              placeholder={['2015-10-10', '2015-10-10']}
            />

            <Button
              type="primary"
              onClick={handleExport}
              loading={exporting}
            >
              导出
            </Button>
          </Space>
        </div>
      </div>

      <ProTable<OrderItem>
        columns={columns}
        actionRef={actionRef}
        request={fetchData}
        rowKey="orderId"
        search={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `共 ${total} 条`,
        }}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={false}
        options={false}
        className="order-table"
      />
    </div>
  );
};

export default OrderManagement;
