import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import app from '../../singletons';


export type ModeDefault = { name: 'default', params?: void }
export type ModeStatic = {
  name: 'static',
  params: {
    color: {
      r: number;
      g: number;
      b: number;
    };
  };
};
export type ModeColorcycle = {
  name: 'colorcycle',
  params: {
    speed: number;
  };
};

export type Mode =
| ModeDefault
| ModeStatic
| ModeColorcycle

export type ModeNames = Mode['name'];

export interface State {
  mode: Mode;
}

const initialState: State = {
  mode: {
    name: 'default',
  },
};

export const slice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode: (state, { payload }: PayloadAction<Mode>) => {
      state.mode = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMode.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
    builder.addCase(switchMode.fulfilled, (state, action) => {
      state.mode = action.payload;
      console.log(action.payload);
    });
  },
});

export const { setMode } = slice.actions;

export const fetchMode = createAsyncThunk(
  'rgb/fetch',
  async (): Promise<Mode> => {
    return await app('connection').send('get_rgb_mode');
  },
);

export const switchMode = createAsyncThunk(
  'rgb/switch',
  async (mode: Mode) => {
    await app('connection').send('set_rgb_mode', mode);
    return mode;
  },
);

export default slice.reducer;
