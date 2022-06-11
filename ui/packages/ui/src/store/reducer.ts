import { combineReducers } from '@reduxjs/toolkit';

import connectionReducer from '~/store/slices/connection';
import modeReducer from '~/store/slices/mode';
import powerReducer from '~/store/slices/power';
import rgbReducer from '~/store/slices/rgb';
import statsReducer from '~/store/slices/stats';


export default combineReducers({
  connection: connectionReducer,
  mode: modeReducer,
  power: powerReducer,
  rgb: rgbReducer,
  stats: statsReducer,
} as const);
