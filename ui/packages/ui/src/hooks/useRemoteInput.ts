import { useCallback, useRef, useState } from 'react';

import { useCurrentValue } from './useCurrentValue';


export const useRemoteInput = <T>(remoteValue: T, setRemoteValue: (value: T) => Promise<void>) => {
  const [localValue, setLocalValue] = useState<T | undefined>(undefined);
  const lastRemoteValueSetter = useRef<symbol>();
  const currentSetRemoteValue = useCurrentValue(setRemoteValue);

  const setValue = useCallback((value: T) => {
    const currentRemoteValueSetter = Symbol();
    lastRemoteValueSetter.current = currentRemoteValueSetter;

    setLocalValue(value);

    const resetCurrentLocalValue = () => {
      if (lastRemoteValueSetter.current !== currentRemoteValueSetter) {
        return;
      }

      setLocalValue(undefined);
    };

    currentSetRemoteValue.current(value)
      .then(
        resetCurrentLocalValue,
        error => {
          console.error(error);
          resetCurrentLocalValue();
        }
      );
  }, []);

  return [localValue ?? remoteValue, setValue, localValue !== undefined] as const;
};
