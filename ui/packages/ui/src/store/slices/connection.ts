import { PayloadAction, createSlice } from '@reduxjs/toolkit';


export interface State {
  isConnecting: boolean;
  isConnected: boolean;
}

const initialState: State = {
  isConnecting: false,
  isConnected: false,
};

export const slice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setIsConnecting: (state, { payload }: PayloadAction<boolean>) => {
      state.isConnecting = payload;
    },
    setIsConnected: (state, { payload }: PayloadAction<boolean>) => {
      state.isConnected = payload;
    },
  },
});

export const { setIsConnecting, setIsConnected } = slice.actions;

export default slice.reducer;
