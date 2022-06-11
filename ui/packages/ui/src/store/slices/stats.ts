import { PayloadAction, createSlice } from '@reduxjs/toolkit';


export interface State {
  current?: {
    temps: {
      cpu: number;
      gpu: number;
    };
  };
}

const initialState: State = {
  current: undefined,
};

export const slice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStats: (state, { payload }: PayloadAction<State['current']>) => {
      state.current = payload;
    },
  },
});

export const { setStats } = slice.actions;

export default slice.reducer;
