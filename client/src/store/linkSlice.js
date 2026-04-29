import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { linkApi } from '../api/api';

export const shortenLink = createAsyncThunk(
  'links/shorten',
  async (originalUrl) => {
    const response = await linkApi.shortenLink(originalUrl);
    return response.data;
  }
);

export const fetchStats = createAsyncThunk(
  'links/fetchStats',
  async (shortCode) => {
    const response = await linkApi.getStats(shortCode);
    return response.data;
  }
);

const linkSlice = createSlice({
  name: 'links',
  initialState: {
    currentLink: null,
    currentStats: null,
    loading: false,
    error: null
  },
  reducers: {
    clearStats: (state) => {
      state.currentStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(shortenLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shortenLink.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLink = action.payload;
      })
      .addCase(shortenLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearStats } = linkSlice.actions;
export default linkSlice.reducer;
