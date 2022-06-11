import { useRef } from 'react';


export const useCurrentValue = <T>(value: T): { current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
