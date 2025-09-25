import React, { useCallback, useEffect, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Table , Pagination,Select, FloatButton,Menu} from 'antd'

interface HomeProps {
  name: string,
  age: number,
  sex:string,
  address:string;
}
const items = [
  {
    key: 'sub1',
    label: 'Navigation One',
    icon: <MailOutlined />,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
      {
        key: 'g2',
        label: 'Item 2',
        type: 'group',
        children: [
          { key: '3', label: 'Option 3' },
          { key: '4', label: 'Option 4' },
        ],
      },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    icon: <AppstoreOutlined />,
    children: [
      { key: '5', label: 'Option 5' },
      { key: '6', label: 'Option 6' },
      {
        key: 'sub3',
        label: 'Submenu',
        children: [
          { key: '7', label: 'Option 7' },
          { key: '8', label: 'Option 8' },
        ],
      },
    ],
  },
  {
    type: 'divider',
  },
  {
    key: 'sub4',
    label: 'Navigation Three',
    icon: <SettingOutlined />,
    children: [
      { key: '9', label: 'Option 9' },
      { key: '10', label: 'Option 10' },
      { key: '11', label: 'Option 11' },
      { key: '12', label: 'Option 12' },
    ],
  },
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
];

const columns = [
  {
    key:'name',
    dataIndex:'name',
    title:'姓名'

  },
  {
    ket:'age',
    dataIndex:'age',
    title:'年龄'
  },
  {
    key:'address',
    dataIndex:'address',
    title:'地址',
  }
];
const dataSource = [
  {
    key:'1',
    name:'cl',
    age:18,
    address:'hangzhou'
  },
  {
    key:'2',
    name:'hx',
    age:20,
    address:"guizhou"
  },
  {
    key:'3',
    name:'jqq',
    age:20,
    address:"xinjiang"
  }
]
const Home: React.FC<HomeProps> = (props) => {
  const {} = props;
  const [state, setState] = useState(null);

  useEffect(() => {
    
  }, []);

  return (
    <div>
       <Menu
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
      <Select
      showSearch
      autoFocus={true}
      placeholder={"请输入想要搜索的人名"} 
      mode="multiple"
      maxTagCount={2}
      notFoundContent={"暂无数据"}
      style={{ width: 200 }}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}/>
      <Table dataSource={dataSource} columns={columns} pagination={false}></Table>
      <Pagination align='end' defaultCurrent={1} showSizeChanger	></Pagination>

      <FloatButton/>
      
    </div>
  );
};

export default Home;