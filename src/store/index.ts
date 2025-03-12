// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import notificationReducer from './notificationSlice'
import socketReducer from './socketSlice';
import { socketMiddleware } from './socketMiddleware';
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    userData: userReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;