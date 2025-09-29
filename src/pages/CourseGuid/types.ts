// 引导项类型
export interface GuideItem {
  id: string;
  type: 'status' | 'title';
  text?: string; // 状态项的文字
  title?: string; // 标题项的文字
  isOk?: boolean; // 状态项的完成状态
  pageUrl?: string; // 跳转链接
  buttonText?: string; // 按钮文字
  showButton?: boolean; // 是否显示按钮
}

// 组件Props接口
export interface CourseGuideCardProps {
  title: string;
  items: GuideItem[];
  showMainButton?: boolean;
  mainButtonText?: string;
  onMainButtonClick?: () => void;
  className?: string;
}
