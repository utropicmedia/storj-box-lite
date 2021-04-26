import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface BucketState {
  bucket: string | null | undefined;
  delimiter: string;
  prefix: string;
}

// Define the initial state using that type
const initialState: BucketState = {
  bucket: undefined,
  delimiter: "/",
  prefix: "/",
};

export const bucketSlice = createSlice({
  name: "bucket",
  initialState,
  reducers: {
    setBucketState: (state, action: PayloadAction<BucketState>) => {
      state = action.payload;
      return state;
    },
    setBucket: (state, action: PayloadAction<string | null | undefined>) => {
      state.bucket = action.payload;
      return state;
    },
  },
});

export const { setBucketState, setBucket } = bucketSlice.actions;
export const selectBucket = (state: RootState) => state.bucket.bucket;
export const selectBucketParams = (state: RootState) => {
  const { delimiter, prefix } = state.bucket;
  return { delimiter, prefix };
};
export const selectBucketState = (state: RootState) => state.bucket;
export default bucketSlice.reducer;
