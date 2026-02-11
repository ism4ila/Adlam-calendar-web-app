import { useEffect, useState } from 'react';
import { readJson, writeJson } from '../utils/storage';

export const usePersistentState = <T>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => readJson<T>(key, initial));

  useEffect(() => {
    writeJson<T>(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};
