import React, { ReactElement } from "react";
import AppLogo from "../components/AppLogo";
import Head from "../components/Head";

export default function SignUp(): ReactElement {
  return (
    <>
      <Head title="Sign Up | Storj Box Lite" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <AppLogo size="md" color="brand" />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            Sign Up Form
          </div>
        </div>
      </div>
    </>
  );
}
