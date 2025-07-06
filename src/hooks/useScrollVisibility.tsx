import { useEffect, useState } from 'react';

let timer: any;

const useScrollVisibility = (ref: { current: HTMLDivElement }, timeout = 1000) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      // 清除之前的定时器
      clearTimeout(timer);

      // 设置新的定时器，在停止滚动后隐藏滚动条
      timer = setTimeout(() => {
        setIsScrolling(false);
      }, timeout);
    };

    if(ref.current) {
      const element = ref.current;
      element.addEventListener('scroll', handleScroll);

      return () => {
        element.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }
    
  }, [ref, timeout]);

  return isScrolling;
};

export default useScrollVisibility;