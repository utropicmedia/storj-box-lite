import { Bucket as S3Bucket } from "@aws-sdk/client-s3";
import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { StorjClient } from "../../lib/storjClient";
import { AuthSettings } from "../settings/settingsSlice";
import { RootState } from "../store";

export interface Bucket {
  CreationDate: string;
  Name: string;
}

export const mapS3Buckets = (buckets: S3Bucket[]) =>
  buckets.map(
    (bucket) =>
      ({
        CreationDate: bucket.CreationDate?.toISOString(),
        Name: bucket.Name,
      } as Bucket)
  );

export const getBuckets = createAsyncThunk<
  Bucket[] | undefined,
  AuthSettings,
  { state: RootState }
>("bucket/getBuckets", async (auth, { getState }) => {
  if (!auth || !auth?.accessKeyId || !auth?.secretAccessKey) {
    throw new Error("Auth is required");
  }
  const { loading } = getState().buckets;
  if (!loading) {
    return;
  }
  const client = StorjClient.getInstanceProfile(auth);
  const response = await client?.listBuckets();
  return response && response.Buckets ? mapS3Buckets(response.Buckets) : [];
});

export interface BucketsState {
  buckets: Bucket[] | undefined;
  error: SerializedError | undefined;
  loading: boolean;
}

// Define the initial state using that type
const initialState: BucketsState = {
  buckets: undefined,
  error: undefined,
  loading: false,
};

export const bucketsSlice = createSlice({
  name: "buckets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBuckets.pending, (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(getBuckets.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.buckets = action.payload;
    });
    builder.addCase(getBuckets.rejected, (state, action) => {
      state.loading = false;
      state.buckets = [];
      state.error = action.error;
    });
  },
});

export const selectBuckets = (state: RootState) => state.buckets;
export default bucketsSlice.reducer;
