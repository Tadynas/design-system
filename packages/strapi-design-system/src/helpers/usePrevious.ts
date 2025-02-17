/**
 * TODO: This should be moved to the `hooks` folder
 */
import { useRef, useEffect } from 'react';

export const usePrevious = <TValue>(value: TValue): TValue | undefined => {
  const ref = useRef<TValue>();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
