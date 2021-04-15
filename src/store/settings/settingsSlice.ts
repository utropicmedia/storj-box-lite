import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface SettingsState {
  auth?: AuthSettings;
}

// Define the initial state using that type
const initialState: SettingsState = {};

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
});

export const { resetSettings, setSettings } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default settingsSlice.reducer;
