import { StorjClient } from "lib/storjClient";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectBucketState } from "store/bucket/bucketSlice";
import { selectSettings } from "store/settings/settingsSlice";

export default function BucketListing() {
  const bucketState = useSelector(selectBucketState);
  const { settings, loading } = useSelector(selectSettings);
  const [contents, setContents] = useState();

  useEffect(() => {
    console.log("BucketListing useEffect");
    async function loadDirectory() {
      console.log("loadDirectory");
      const client = StorjClient.getInstance(settings.auth);
      const response = await client?.listDirectories({
        Bucket: bucketState.bucket,
        Delimiter: bucketState.delimiter,
        Prefix: bucketState.prefix,
      });
      console.log("loadDirectory response", response);
      setContents(response?.Contents);
    }
    if (
      !loading &&
      settings &&
      bucketState &&
      bucketState.bucket &&
      bucketState.delimiter
    ) {
      loadDirectory();
    }
  }, [bucketState, loading, settings]);

  // useEffect(() => {
  //   console.log("BucketListing useEffect");
  // }, []);

  return (
    <>
      <div>BucketListing</div>
      <ul>
        <li>
          <Link to={"/home"}>/</Link>
        </li>
        <li>
          <Link to={"/home/test"}>Test</Link>
        </li>
      </ul>
      {contents && <pre>{JSON.stringify(contents, null, 2)}</pre>}
    </>
  );
}
