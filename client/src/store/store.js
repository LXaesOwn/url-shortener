import { configureStore } from '@reduxjs/toolkit';
import linkReducer from './linkSlice';

export const store = configureStore({
  reducer: {
    links: linkReducer
  }
});