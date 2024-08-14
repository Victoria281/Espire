import rootReducers from "./reducers";
import { configureStore } from '@reduxjs/toolkit'
import { saveState, loadState } from "./persistStore";
import { thunk } from "redux-thunk"

const persistedStore = loadState();
export const store = configureStore({
    reducer: rootReducers,
    preloadedState: persistedStore,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

store.subscribe(() => {
    saveState(store.getState());
});