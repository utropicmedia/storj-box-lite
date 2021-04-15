import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthSettings {
  accessKeyId: string;
  secretAccessKey: string;
}

export interface BucketState {
  selectedBucket?: string;
}

// Define the initial state using that type
const initialState: BucketState = {};

export const bucketSlice = createSlice({
  name: "bucket",
  initialState,
  reducers: {
    setSelectedBucket: (state, action: PayloadAction<string>) => {
      state.selectedBucket = action.payload;
      return state;
    },
  },
});

export const { setSelectedBucket } = bucketSlice.actions;
export const selectSelectedBucket = (state: RootState) =>
  state.bucket.selectedBucket;
export default bucketSlice.reducer;
