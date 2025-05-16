import { configureStore } from '@reduxjs/toolkit'
import sourceReducer from '../features/source/sourceSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // usa localStorage

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  source: sourceReducer,
})

const persistedReducer = persistReducer(
  { key: 'root', storage },
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
