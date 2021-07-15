// import React from "react";
// import { useLocation } from "react-router";

// export const StorjDcs = () => {
//   const location = useLocation();

//   return (
//     <div>
//       <div>Storj DCS</div>
//       <div>location: {location.pathname}</div>
//     </div>
//   );
// };

// export default StorjDcs;

import React from "react";
import { useParams } from "react-router";
import { BucketsListTwo } from "../components/BucketListTwo";
import Head from "../components/Head";

export const BucketPage = () => {
  const { bucketName } = useParams<{ bucketName: string }>();

  return (
    <>
      <Head title="Bucket | Storj Box Lite" />
      {!bucketName && <BucketsListTwo />}
      {/* {bucketName && <BucketContents bucket={bucketName} />} */}
    </>
  );
};

export default BucketPage;
