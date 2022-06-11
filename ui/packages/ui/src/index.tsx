import { MantineProvider } from '@mantine/core';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.scss';

import app, { AppContext, Singletons, useApp } from '~/singletons';

import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);


const AppContainer = () => {
  const connection = useApp('connection');
  const store = useApp('store');

  useEffect(() => {
    connection.open();
  }, [connection]);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </Provider>
    </React.StrictMode>
  );
};

root.render(
  (
    <AppContext.Provider value={app}>
      <AppContainer />
    </AppContext.Provider>
  ),
);
