import React, { ReactElement } from "react";
import AuthSettings from "../components/AuthSettings";
import Head from "../components/Head";

export default function Settings(): ReactElement {
  return (
    <>
      <Head title="Settings | Storj Box Lite" />
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
      </div>

      <div className="mt-4 mx-auto px-4 sm:px-6 md:px-8">
        <AuthSettings />
      </div>

      {/* <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <BucketSettings />
      </div> */}
    </>
  );
}
