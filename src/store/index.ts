import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counter'
import authReducer from './slices/auth'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
