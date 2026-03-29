import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that syncs state with localStorage.
 *
 * @param {string} key        localStorage key
 * @param {*}      initialValue  fallback when key is absent or unparseable
 * @returns {[*, Function]}   [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  // Lazy initialiser: read from localStorage once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: failed to parse key "${key}"`, error);
      return initialValue;
    }
  });

  // Persist to localStorage whenever key or storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`useLocalStorage: failed to set key "${key}"`, error);
    }
  }, [key, storedValue]);

  // Stable setter that mirrors useState's API (accepts value or updater fn)
  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        return nextValue;
      });
    },
    [],
  );

  return [storedValue, setValue];
}
