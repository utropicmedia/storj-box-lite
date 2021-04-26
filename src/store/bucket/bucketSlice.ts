import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BucketState {
  currentFolderPath?: string;
  selectedBucket?: string;
}

// Define the initial state using that type
const initialState: BucketState = {};

export const bucketSlice = createSlice({
  name: "bucket",
  initialState,
  reducers: {
    setBucketState: (state, action: PayloadAction<BucketState>) => {
      state = action.payload;
      return state;
    },
    setCurrentFolderPath: (state, action: PayloadAction<string>) => {
      state.currentFolderPath = action.payload;
      return state;
    },
    setSelectedBucket: (state, action: PayloadAction<string>) => {
      state.selectedBucket = action.payload;
      return state;
    },
  },
});

export const {
  setBucketState,
  setCurrentFolderPath,
  setSelectedBucket,
} = bucketSlice.actions;
export const selectSelectedBucket = (state: RootState) =>
  state.bucket.selectedBucket;
export const selectCurrentFolderPath = (state: RootState) =>
  state.bucket.currentFolderPath;
export const selectBucketState = (state: RootState) => state.bucket;
export default bucketSlice.reducer;
