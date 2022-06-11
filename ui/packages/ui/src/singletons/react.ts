import { createContext, useCallback, useContext, useSyncExternalStore } from 'react';

import { App as AnyApp } from '~/singletons/app';


export const connectApp = <Singletons>() => {
  // type Singletons = App extends AnyApp<infer S> ? S : never;

  const Context = createContext<AnyApp<Singletons> | undefined>(undefined);

  return {
    Context,

    useApp: <K extends keyof Singletons>(key: K): Singletons[K] => {
      const app = useContext(Context);
      if (app === undefined) {
        throw new Error('Application is not provided in this context');
      }

      return useSyncExternalStore(
        useCallback(onChanged => {
          return app.subscribe(key, onChanged);
        }, [app, key]),
        () => app(key)
      );
    },
  };
};
