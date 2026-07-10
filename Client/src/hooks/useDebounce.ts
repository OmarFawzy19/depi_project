import { useEffect, useState } from "react";


export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Set a timer to update debounced value after the delay
    const timer = setTimeout(() => setDebounced(value), delay);

    // If value changes before delay is up, cancel the previous timer
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
