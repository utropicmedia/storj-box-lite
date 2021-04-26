import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectBucketState, setBucketState } from "store/bucket/bucketSlice";
import BucketListing from "../components/BucketListing";
import HomeBreadcrumbs from "../components/HomeBreadcrumbs";

export default function Home() {
  const bucketState = useSelector(selectBucketState);
  const { folderPath } = useParams<{ folderPath: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Home, folderPath", bucketState.prefix, folderPath);
    if (
      bucketState &&
      bucketState.bucket &&
      bucketState.prefix !== folderPath
    ) {
      console.log("dispatch the thing");
      dispatch(
        setBucketState({
          ...bucketState,
          prefix: folderPath,
        })
      );
    }
  }, [bucketState, folderPath, dispatch]);

  useEffect(() => {
    console.log("Home, bucketState", bucketState);
  }, [bucketState]);

  return (
    <>
      {bucketState && bucketState.prefix === folderPath && (
        <>
          <HomeBreadcrumbs />
          <BucketListing />

          <pre>{JSON.stringify(bucketState, null, 2)}</pre>
        </>
      )}
    </>
  );
}
