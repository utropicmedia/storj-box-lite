import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreCollection } from "../../lib/firebase";
import { RootState } from "../store";

export const getSettings = createAsyncThunk<
  Settings | undefined,
  User,
  { state: RootState }
>("settings/getSettings", async (user, { getState }) => {
  const { loading } = getState().settings;
  if (!loading) {
    return;
  }
  const docRef = await doc(firestoreCollection, user.uid);
  const userDocument = await getDoc(docRef);
  // const userDocument = await firestoreCollection.doc(user.uid).get();
  const data = userDocument.data() as Settings;
  return data;
});

export const saveCredentialProfiles = createAsyncThunk<
  CredentialProfile[] | undefined,
  {
    credentialProfiles: CredentialProfile[];
    user: User;
  },
  { state: RootState }
>(
  "settings/saveCredentialProfiles",
  async ({ credentialProfiles, user }, { getState }) => {
    const { loading } = getState().settings;
    if (!loading) {
      return;
    }
    const docRef = doc(firestoreCollection, user?.uid);
    await setDoc(docRef, { credentialProfiles }, { merge: true });
    return credentialProfiles;
  }
);

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export type CredentialProfileType = "storjDcs";

export interface CredentialProfile {
  credentials: AuthSettings;
  id: string;
  nickname: string;
  type: CredentialProfileType;
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

    builder.addCase(saveCredentialProfiles.pending, (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(saveCredentialProfiles.fulfilled, (state, action) => {
      state.loading = false;
      state.settings!.credentialProfiles = action.payload;
    });
    builder.addCase(saveCredentialProfiles.rejected, (state, action) => {
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
