import BucketContents from "components/BucketContents";
import BucketsList from "components/BucketsList";
import React from "react";
import { useParams } from "react-router";
import Head from "../components/Head";

export const BucketPage = () => {
  const { bucketName } = useParams();

  return (
    <>
      <Head title="Bucket | Storj Box Lite" />
      {!bucketName && <BucketsList />}
      {bucketName && <BucketContents bucket={bucketName} />}
    </>
  );
};

export default BucketPage;
