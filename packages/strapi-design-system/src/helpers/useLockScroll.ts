/**
 * TODO: This should be moved to the `hooks` folder
 */
import { useEffect } from 'react';

const useLockScroll = (lockScroll: boolean) => {
  useEffect(() => {
    if (lockScroll) {
      document.body.classList.add('lock-body-scroll');
    }

    return () => {
      document.body.classList.remove('lock-body-scroll');
    };
  }, [lockScroll]);
};

export default useLockScroll;
