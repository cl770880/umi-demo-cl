import React, { useCallback, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import StudentManagement  from './studentManagerList';
import InviteStudent from './invaiteStudennts';

interface IndexProps {
  id: string;
}

const items = [
  {
    key:'studentManageList',
    label: '学生管理',
    children: <StudentManagement classId='123' />,
  },
  {
    key:'inviteStudent',
    label: '邀请学生',
    children: <InviteStudent classId='123' />,
  }
]
const Index: React.FC<IndexProps> = (props) => {
  const {id} = props;
  const [state, setState] = useState(null);

  useEffect(() => {
    
  }, []);

  return (
    <div style={{marginLeft:20}}>
      <Tabs items={items} />
    </div>
  );
};

export default Index;