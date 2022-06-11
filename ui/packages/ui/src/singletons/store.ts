import { AppStore, createStore } from '~/store';

import { App } from '.';


declare module '~/singletons' {
  export interface Singletons {
    store: AppStore;
  }
}

const registerStore = (app: App, createStoreFn: typeof createStore) => {
  app.register(
    'store',
    () => createStoreFn()
  );
};

export default (app: App) => {
  registerStore(app, createStore);

  if (module.hot) {
    module.hot.accept('~/store', () => {
      registerStore(app, require('~/store').default);
    });
  }
};
