import { configureStore } from "@reduxjs/toolkit";

import { authSlice } from "./containers/Auth/state";

export const reducers = {
  auth: authSlice.reducer,
};

const store = configureStore({
  reducer: reducers,
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
