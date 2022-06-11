import dispatcher from '~/connection/dispatcher';

import { App } from '.';


declare module '~/singletons' {
  export interface Singletons {
    connection: ReturnType<typeof dispatcher>;
  }
}

const registerConnection = (app: App, dispatcherConstructor: typeof dispatcher) => {
  app.register(
    'connection',
    'store',
    store => dispatcherConstructor(store)
  );
};

export default (app: App) => {
  registerConnection(app, dispatcher);

  if (module.hot) {
    module.hot.accept('~/connection/dispatcher', () => {
      registerConnection(app, dispatcher);
    });
  }
};
