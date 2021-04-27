import React from "react";
import { useParams } from "react-router";
import { BucketContents } from "../components/BucketContents";
import { BucketsList } from "../components/BucketsList";

export const BucketPage = () => {
  const { bucketName } = useParams<{ bucketName: string }>();

  return (
    <>
      {!bucketName && <BucketsList />}
      {bucketName && <BucketContents bucket={bucketName} />}
    </>
  );
};

export default BucketPage;
