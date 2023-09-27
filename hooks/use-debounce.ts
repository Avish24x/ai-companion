import { useEffect, useState } from "react";

// Custom React hook for debouncing a value
export function useDebounce<T>(value: T, delay?: number): T {
  // Create a state variable 'debouncedValue' initialized with the provided 'value'
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Inside the useEffect hook:

    // Set up a timer using setTimeout
    const timer = setTimeout(() => {
      // When the timer expires, update 'debouncedValue' with the current 'value'
      setDebouncedValue(value);
    }, delay || 500); // Use the provided 'delay' or default to 500 milliseconds

    // Return a cleanup function
    return () => {
      // This function will clear the timer when the component unmounts or when 'value' or 'delay' changes
      clearTimeout(timer);
    };
  }, [value, delay]); // Run this effect whenever 'value' or 'delay' changes

  // Return the 'debouncedValue', which will update after the specified delay
  return debouncedValue;
}
