import { configureStore } from "@reduxjs/toolkit";
import bucketReducer from "./bucket/bucketSlice";
import bucketsReducer from "./buckets/bucketsSlice";
import settingsReducer from "./settings/settingsSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
  reducer: {
    bucket: bucketReducer,
    buckets: bucketsReducer,
    settings: settingsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
