import React from 'react';
import useTypedThrottle from '@/hooks/useTypedThrottle';

interface TypedThrottleProps {
  children: string | any[];
  speed?: number;
}

const TypedThrottle: React.FC<TypedThrottleProps> = ({ children, speed }) => {
  const typed = useTypedThrottle(children, { speed });
  return typed;
};

export default TypedThrottle;