import BucketListProfile from "components/BucketListProfile";
import React from "react";
import { useParams } from "react-router";
import Head from "../components/Head";
import BucketPage from "./BucketPage";

export const BucketPageProfile = () => {
  const { bucketName, profile } = useParams();

  console.log(bucketName, profile);

  return (
    <>
      <Head title={`${bucketName ? "Buckets" : "Profile"} | Box Lite`} />
      {profile && !bucketName && <BucketListProfile />}
      {profile && bucketName && <BucketPage />}
    </>
  );
};

export default BucketPageProfile;
