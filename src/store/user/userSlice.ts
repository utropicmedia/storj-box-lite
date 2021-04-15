import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { RootState } from "../store";

export interface UserState extends firebase.UserInfo {}

// Define the initial state using that type
const initialState: Partial<UserState> = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
