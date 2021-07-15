import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError
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
  const data = userDocument.data() as Settings;
  return data;
});

export interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export type CredentialProfileType = "storjDcs";

export interface CredentialProfile {
  credentials: S3Credentials;
  id: string;
  nickname: string;
  type: CredentialProfileType;
}

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface Settings {
  auth: AuthSettings | undefined;
  credentialProfiles: CredentialProfile[] | undefined;
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
  settings: {
    auth: undefined,
    credentialProfiles: undefined,
  },
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
export const selectAuthSettings = (state: RootState) =>
  state.settings.settings?.auth;
export const selectCredentialProfiles = (state: RootState) =>
  state.settings.settings?.credentialProfiles;
export default settingsSlice.reducer;
