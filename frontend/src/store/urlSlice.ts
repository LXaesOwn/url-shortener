import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateUrlResponse, IStatsResponse } from '../types';

interface UrlState {
  currentUrl: ICreateUrlResponse | null;
  stats: IStatsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: UrlState = {
  currentUrl: null,
  stats: null,
  loading: false,
  error: null
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentUrl: (state, action: PayloadAction<ICreateUrlResponse>) => {
      state.currentUrl = action.payload;
      state.error = null;
    },
    setStats: (state, action: PayloadAction<IStatsResponse>) => {
      state.stats = action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { setLoading, setCurrentUrl, setStats, setError, clearError } = urlSlice.actions;
export default urlSlice.reducer;