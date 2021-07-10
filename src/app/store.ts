import { configureStore } from '@reduxjs/toolkit';
import seinfeldReducer from '../features/seinfeld/seinfeldSlice';

export const store = configureStore({
  reducer: {
    seinfeld: seinfeldReducer,
  },
});
