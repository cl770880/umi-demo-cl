import React, { useCallback, useEffect, useState } from 'react';

interface AIWorkPlatformProps {
  termId:number
}

const AIWorkPlatform: React.FC<AIWorkPlatformProps> = (props) => {
  const {termId} = props;
  const [state, setState] = useState(null);

  useEffect(() => {
    
  }, []);

  return (
    <div>
      AIWorkPlatform component
      <div>
        <span>
          djkehfehfeferjge fhge regfj hrgf ref frgf jegjkhewhgey 
          dhj
          <p>
            hahaha 
            <h1>
              222
            </h1>
          </p>
        </span>
      </div>
    </div>
  );
};

export default AIWorkPlatform;