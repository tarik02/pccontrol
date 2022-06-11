import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import app from '../../singletons';


export type State = any

const initialState: State = {
};

export const slice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    //
  },
});

export const status = createAsyncThunk(
  'power/status',
  async () => await fetch('/power/wake')
    .then(response => response.json())
    .then(response => response.status === 'on'),
);

export const wake = createAsyncThunk(
  'power/wake',
  async () => {
    await fetch('/power/wake', { method: 'POST' });
  },
);

export const sleep = createAsyncThunk(
  'power/sleep',
  async () => {
    await fetch('/power/sleep', { method: 'POST' });
  },
);

export default slice.reducer;
