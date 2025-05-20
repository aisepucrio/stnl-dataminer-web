import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import sourceReducer from "../features/source/sourceSlice";
import itemReducer from "../features/items/itemSlice";

// ⬇️ Só importe persist libs no client
const isClient = typeof window !== "undefined";

let store: ReturnType<typeof configureAppStore>;
let persistor: any = null;

const rootReducer = combineReducers({
  source: sourceReducer,
  item: itemReducer,
});

function configureAppStore() {
  if (isClient) {
    const {
      persistStore,
      persistReducer,
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER,
    } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;

    const persistedReducer = persistReducer(
      { key: "root", storage },
      rootReducer
    );

    const _store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });

    persistor = persistStore(_store);
    return _store;
  } else {
    return configureStore({
      reducer: rootReducer,
    });
  }
}

store = configureAppStore();

export { store, persistor };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
