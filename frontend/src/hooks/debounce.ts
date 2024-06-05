import { useEffect, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  const timeoutRef = useRef<number | undefined>(undefined);

  const debouncedFunc = (...args: Parameters<T>) => {
    if (timeoutRef.current !== undefined) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      func(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunc as T;
};
