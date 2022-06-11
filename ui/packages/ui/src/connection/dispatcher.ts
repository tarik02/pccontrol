import { AppStore } from '~/store';

import { createConnection } from '../connection';
import { setIsConnected, setIsConnecting } from '../store/slices/connection';
import { fetchMode, setMode } from '../store/slices/mode';
import { fetchMode as fetchRgbMode, setMode as setRgbMode } from '../store/slices/rgb';
import { setStats } from '../store/slices/stats';


export default (store: AppStore) => {
  const connection = createConnection({
    onConnectionAttempt: async () => {
      store.dispatch(setIsConnecting(true));
    },
    onConnected: async () => {
      store.dispatch(setIsConnected(true));
      store.dispatch(setIsConnecting(false));
      store.dispatch(fetchMode(false));
      store.dispatch(fetchRgbMode());
    },
    onDisconnected: async () => {
      store.dispatch(setIsConnected(false));
    },
    onMessage: (type, payload) => {
      switch (type) {
      case 'set_mode':
        store.dispatch(setMode(payload.mode));
        break;
      case 'set_rgb_mode':
        store.dispatch(setRgbMode(payload.mode));
        break;
      case 'stats':
        store.dispatch(setStats(payload));
        break;
      }
    },
  });

  if (module.hot) {
    module.hot.dispose(() => {
      connection.close();
    });
  }

  return connection;
};
