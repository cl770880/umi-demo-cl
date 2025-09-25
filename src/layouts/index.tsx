import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/table">Table</Link>
        </li>
        <li>
          <Link to="/courseGuide">课程引导页</Link>
        </li>
        <li>
          <Link to="/studentManager">学生管理</Link>
        </li>
        <li>
          <a href="https://github.com/umijs/umi">Github</a>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
