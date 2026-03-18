import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'umi';
import { Layout, Menu, theme } from 'antd';
import {
  DesktopOutlined,
  TeamOutlined,
  FileTextOutlined,
  BookOutlined,
  EditOutlined,
  MessageOutlined,
  DatabaseOutlined,
  QuestionCircleOutlined,
  FolderOutlined,
  HomeOutlined
} from '@ant-design/icons';
import styles from './index.less';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: string;
  path?: string;
};

const menuItems: MenuItem[] = [
  {
    key: 'ai-workspace',
    icon: <DesktopOutlined />,
    label: 'AI教学工作台',
    path: '/aiWorkPlatform'
  },
  {
    key: 'class-activities',
    icon: <TeamOutlined />,
    label: '班级教学活动',
    path: '/studentManager'

  },
  {
    key: 'new-content',
    icon: <FileTextOutlined />,
    label: '新形态内容',
    children: [
      {
        key: 'chapter-list',
        label: '章节目录',
        path: '/courseGuide'
      },
      {
        key: 'digital-textbook',
        label: '数字教材',
        path: '/table'
      },
      {
        key: 'online-course',
        label: '订单管理',
        path: '/orderManagement'
      }
    ]
  },
  {
    key: 'course-resources',
    icon: <DatabaseOutlined />,
    label: '课程资源库',
    children: [
      {
        key: 'courseware',
        label: '课件库',
        path: '/docs'
      },
      {
        key: 'homework',
        label: '作业库',
        path: '/'
      },
      {
        key: 'discussion',
        label: '讨论库',
        path: '/'
      },
      {
        key: 'quiz',
        label: '问卷库',
        path: '/'
      },
      {
        key: 'question-bank',
        label: '题库',
        path: '/'
      }
    ]
  },
  {
    key: 'others',
    icon: <FolderOutlined />,
    label: '其他',
    children: [
      {
        key: 'home-simple',
        label: '首页',
        path: '/'
      }
    ]
  },
  {
    key: 'help',
    icon: <QuestionCircleOutlined />,
    label: '学生成绩管理',
    path: '/studentScoreManage'
  }
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 根据当前路径获取选中的菜单项
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (item.path === currentPath) {
        return [item.key];
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === currentPath) {
            return [child.key];
          }
        }
      }
    }
    return ['ai-workspace']; // 默认选中
  };

  // 获取展开的菜单项
  const getOpenKeys = () => {
    const currentPath = location.pathname;
    for (const item of menuItems) {
      if (item.children) {
        for (const child of item.children) {
          if (child.path === currentPath) {
            return [item.key];
          }
        }
      }
    }
    return [];
  };

  // 渲染菜单项
  const renderMenuItems = (items: MenuItem[]): any[] => {
    return items.map((item) => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: renderMenuItems(item.children),
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.path ? (
          <Link to={item.path}>{item.label}</Link>
        ) : (
          item.label
        ),
      };
    });
  };

  return (
    <Layout className={styles.layout}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={240}
      >
        <div className={styles.logo}>
          <HomeOutlined /> 教学工作台
        </div>
        <Menu
          theme="light"
          defaultSelectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          mode="inline"
          items={renderMenuItems(menuItems)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content className={styles.content} style={{ margin: '12px 12px' }}>
          <div
            style={{
              padding: 16,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
        
      </Layout>
    </Layout>
  );
}
