import { useEffect, useState } from "react";

/**
 * useDebounce — delays updating a value until the user stops changing it.
 *
 * Example:
 *   const [search, setSearch] = useState("");
 *   const debouncedSearch = useDebounce(search, 300);
 *   // debouncedSearch only updates 300ms after the user stops typing
 *
 * @param value - the value to debounce (e.g. search input)
 * @param delay - milliseconds to wait (default 300ms)
 */
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
