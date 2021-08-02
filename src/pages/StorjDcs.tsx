import React from "react";
import { useParams } from "react-router";
import { BucketListProfile } from "../components/BucketListProfile";
import Head from "../components/Head";

export const BucketPage = () => {
  const { bucketName } = useParams<{ bucketName: string }>();

  return (
    <>
      <Head title="Bucket | Storj Box Lite" />
      {!bucketName && <BucketListProfile />}
    </>
  );
};

export default BucketPage;
