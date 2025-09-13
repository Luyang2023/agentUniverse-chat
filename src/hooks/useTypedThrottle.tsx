import { isString } from 'lodash';
import { useState, useEffect, useRef } from 'react';

function useTypedThrottle<T extends string | any[]>(origin: T, { speed = 300, disabled = false } = {}) {
  const [typed, setTyped] = useState<T>(() => (isString(origin) ? '' : []) as T);
  const index = useRef<number>(0);

  const deltaTime = speed / (origin?.length - typed?.length);

  useEffect(() => {
    if (disabled) {
      setTyped(origin);
      return;
    }

    if (!origin) {
      return;
    }

    const interval = setInterval(() => {
      try {
        setTyped(origin.slice(0, index.current) as T);
        index.current++;
      } catch (error) {
        clearInterval(interval);
      }
      if (index.current > origin.length) {
        clearInterval(interval);
      }
    }, deltaTime);

    return () => interval && clearInterval(interval);
  }, [origin, deltaTime]);

  return typed;
};

export default useTypedThrottle;
