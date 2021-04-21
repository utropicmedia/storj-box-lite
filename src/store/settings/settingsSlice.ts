import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { firestoreCollection } from "../../lib/firebase";
import { RootState } from "../store";

export const getUserSettings = createAsyncThunk(
  "settings/getUserSettings",
  async (user: firebase.User, { getState }) => {
    const { loading } = getState().settings;
    if (loading !== "pending") {
      return;
    }
    const userDocument = await firestoreCollection.doc(user.uid).get();
    const data = userDocument.data() as SettingsState;
    return data;
  }
);

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface SettingsState {
  settings: {
    auth?: AuthSettings;
  };
  loading: string;
  error: Error | null;
}

// Define the initial state using that type
const initialState: SettingsState = {
  settings: {},
  loading: "idle",
  error: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      state = initialState;
      return state;
    },
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      state = action.payload;
      return state;
    },
  },
  extraReducers: {
    [getUserSettings.pending]: (state) => {
      console.log("getUserSettings.pending");
      if (state.loading === "idle") {
        state.loading = "pending";
      }
    },
    [getUserSettings.fulfilled]: (state, action) => {
      console.log("getUserSettings.fulfilled");
      state.loading = "idle";
      state.settings = action.payload;
    },
    [getUserSettings.rejected]: (state, action) => {
      console.log("getUserSettings.rejected");
      state.loading = "idle";
      state.error = action.error;
    },
  },
});

export const { resetSettings, setSettings } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default settingsSlice.reducer;
