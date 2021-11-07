import BucketListProfile from "components/BucketListProfile";
import React from "react";
import { useParams } from "react-router";
import Head from "../components/Head";

export const BucketPageProfile = () => {
  const { bucketName } = useParams();

  return (
    <>
      <Head title="Bucket | Storj Box Lite" />
      {!bucketName && <BucketListProfile />}
    </>
  );
};

export default BucketPageProfile;
