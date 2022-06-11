import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import app from '../../singletons';


type Mode =
| { name: 'silent' }
| { name: 'idle' }
| { name: 'semi' }
| { name: 'semi2' }
| { name: 'perf' }

export interface State {
  mode: Mode | undefined;
}

const initialState: State = {
  mode: undefined,
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
    });
  },
});

export const { setMode } = slice.actions;

export const fetchMode = createAsyncThunk(
  'mode/fetch',
  async () => {
    return await app('connection').send('get_mode');
  },
);

export const switchMode = createAsyncThunk(
  'mode/switch',
  async (mode: Mode) => {
    await app('connection').send('set_mode', mode);
    return mode;
  },
);

export default slice.reducer;
