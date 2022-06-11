import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducer';


export const createStore = () => {
  const store = configureStore({
    reducer,
  });

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      store.replaceReducer(
        require('./reducer').default
      );
    });
  }

  return store;
};

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
