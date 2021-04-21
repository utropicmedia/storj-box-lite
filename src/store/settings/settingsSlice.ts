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
  defaultBucket?: string;
}

export interface SettingsState {
  error: SerializedError | undefined;
  loading: boolean;
  settings: Settings | undefined;
}

// Define the initial state using that type
const initialState: SettingsState = {
  error: undefined,
  loading: false,
  settings: {},
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
