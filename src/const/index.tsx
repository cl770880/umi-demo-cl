// 1. 嵌入变量（支持表达式，不支持语句）
const titleText = "Hello React";
const title = <h1 className="title">{titleText}</h1>; // 注意：class需写为className（避免与JS关键字冲突）

// 2. 嵌入表达式（函数调用、三元运算等）
const isLogin = true;
const userInfo = <div>{isLogin ? "欢迎回来！" : "请先登录"}</div>;

// 3. 多行JSX需用括号包裹（避免自动插入分号导致语法错误）
const card = (
  <div className="card">
    <img src="avatar.png" alt="头像" />
    <p>用户名：张三</p>
  </div>
);


const userList = [
  { id: 1, name: "张三", age: 18 },
  { id: 2, name: "李四", age: 20 },
  { id: 3, name: "王五", age: 22 },
];

const UserList = () => (
  <ul>
    {userList.map((user) => (
      // key需用唯一值（优先用后端返回的id，避免用index）
      <li key={user.id}>
        姓名：{user.name} | 年龄：{user.age}
      </li>
    ))}
  </ul>
);

const renderContent = (type) => {
  switch (type) {
    case 1: return <div>首页内容</div>;
    case 2: return <div>列表内容</div>;
    case 3: return <div>详情内容</div>;
    default: return <div>默认内容</div>;
  }
};

const Content = () => {
  const type = 2;
  return <div>{renderContent(type)}</div>;
};

// 定义组件映射表
const componentMap = {
  home: <Home />,
  list: <List />,
  detail: <Detail />,
};

const TabContent = () => {
  const activeTab = "list";
  return <div>{componentMap[activeTab]}</div>;
};

import { useState } from "react";

const Counter = () => {
  // 1. 声明状态：参数为初始值，返回[状态变量, 更新函数]
  const [count, setCount] = useState(0); // 初始值可以是任意类型（数字、对象、数组等）

  // 2. 更新状态：两种方式
  const handleIncrement = () => {
    // 方式1：直接传新值（适用于不依赖前状态的场景）
    setCount(count + 1);

    // 方式2：函数式更新（适用于依赖前状态的场景，避免闭包问题）
    // setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <span>计数：{count}</span>
      <button onClick={handleIncrement}>+1</button>
    </div>
  );
};


// 错误：直接修改原对象
const [user, setUser] = useState({ name: "张三", age: 18 });
const updateAge = () => {
  user.age = 19; // 原对象引用未变，React不触发渲染
  setUser(user);
};

// 正确：返回新对象（用扩展运算符...）
const updateAge = () => {
  setUser({ ...user, age: 19 });
};

import { useRef, useState } from "react";

const CommentInput = () => {
  // 1. 创建ref对象：初始值为null
  const inputRef = useRef(null);
  const [comment, setComment] = useState("");

  // 2. 操作DOM：发表评论后清空输入框并聚焦
  const handlePublish = () => {
    // 通过ref.current获取真实DOM元素
    const value = inputRef.current.value;
    if (value.trim()) {
      setComment(value);
      inputRef.current.value = ""; // 清空输入框
      inputRef.current.focus(); // 输入框聚焦
    }
  };

  return (
    <div>
      {/* 3. 绑定ref：将DOM元素赋值给inputRef */}
      <input
        type="text"
        ref={inputRef}
        placeholder="输入评论..."
      />
      <button onClick={handlePublish}>发表</button>
      <p>已发表：{comment}</p>
    </div>
  );
};