import React, { useCallback, useEffect, useState } from 'react';

interface GitTestProps {
  
}

const GitTest: React.FC<GitTestProps> = (props) => {
  const {} = props;
  const [state, setState] = useState(null);

  useEffect(() => {
    
  }, []);

  return (
    <div>
      GitTest component
      <div>这是一个测试组件</div>
      <h1>hahhah</h1>
    </div>
  );
};

export default GitTest;