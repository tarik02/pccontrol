import { App as BaseApp, createApp } from './app';
import registerConnection from './connection';
import { connectApp } from './react';
import registerStore from './store';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Singletons {
}

const app = createApp<Singletons>()
  .use(registerStore)
  .use(registerConnection);

export default app;

export type App = BaseApp<Singletons>;

export const { Context: AppContext, useApp } = connectApp<Singletons>();
