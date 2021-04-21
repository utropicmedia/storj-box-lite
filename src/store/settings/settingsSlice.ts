import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase/app";
import { firestoreCollection } from "../../lib/firebase";
import { RootState } from "../store";

export const getSettings = createAsyncThunk<
  Settings | undefined,
  firebase.User,
  { state: RootState }
>("settings/getSettings", async (user, { getState }) => {
  const { loading } = getState().settings;
  if (!loading) {
    return;
  }
  const userDocument = await firestoreCollection.doc(user.uid).get();
  const data = userDocument.data();
  return data;
});

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface Settings {
  auth?: AuthSettings;
}

export interface SettingsState {
  settings: Settings | undefined;
  loading: boolean;
  error: SerializedError | undefined;
}

// Define the initial state using that type
const initialState: SettingsState = {
  settings: {},
  loading: false,
  error: undefined,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      state = initialState;
      return state;
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.pending, (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(getSettings.fulfilled, (state, action) => {
      state.loading = false;
      state.settings = action.payload;
    });
    builder.addCase(getSettings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const { resetSettings, setSettings } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default settingsSlice.reducer;
