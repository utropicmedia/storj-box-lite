import { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import { StorjClient } from "lib/storjClient";
import { AuthSettings } from "store/settings/settingsSlice";
import { RootState } from "../store";

export type BucketItemType = "file" | "folder";
export interface BucketItem {
  key: string;
  lastModified: string | undefined;
  size: number | undefined;
  type: BucketItemType;
}

interface GetBucketContentsParams {
  auth: AuthSettings;
  bucket: string;
  prefix: string | undefined;
}

export const mapBucketContents = (
  response: ListObjectsV2CommandOutput,
  prefix = ""
) => {
  const items: BucketItem[] = [];
  if (response.CommonPrefixes && response.CommonPrefixes.length > 0) {
    response.CommonPrefixes.forEach((item) => {
      items.push({
        key: String(item.Prefix),
        lastModified: undefined,
        size: undefined,
        type: "folder",
      });
    });
  }
  if (response.Contents && response.Contents.length > 0) {
    response.Contents.forEach((item) => {
      items.push({
        key: String(item.Key),
        lastModified: item.LastModified?.toISOString(),
        size: item.Size,
        type: "file",
      });
    });
  }
  return items;
};

export const getBucketItems = createAsyncThunk<
  BucketItem[] | undefined,
  GetBucketContentsParams,
  { state: RootState }
>("bucket/getBucketItems", async ({ auth, bucket, prefix }, { getState }) => {
  if (!auth || !auth?.accessKeyId || !auth?.secretAccessKey || !bucket) {
    throw new Error("Auth and bucket are required");
  }
  const { loading } = getState().bucket;
  if (!loading) {
    return;
  }
  const client = StorjClient.getInstance(auth);
  const response = await client?.listDirectories({
    Bucket: bucket,
    Delimiter: "/",
    Prefix: prefix,
  });
  return response ? mapBucketContents(response, prefix) : [];
});

export interface BucketState {
  items: BucketItem[] | undefined;
  error: SerializedError | undefined;
  loading: boolean;
}

// Define the initial state using that type
const initialState: BucketState = {
  items: undefined,
  error: undefined,
  loading: false,
};

export const bucketSlice = createSlice({
  name: "bucket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBucketItems.pending, (state) => {
      if (!state.loading) {
        state.loading = true;
      }
    });
    builder.addCase(getBucketItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload as any;
    });
    builder.addCase(getBucketItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const selectBucket = (state: RootState) => state.bucket;
export default bucketSlice.reducer;
