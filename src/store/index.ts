import { configureStore } from '@reduxjs/toolkit';
import wordGameSlice from './slices/wordGameSlice';

export const store = configureStore({
    reducer: {
        wordGameState: wordGameSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;