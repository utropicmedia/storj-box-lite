import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import AppLogo from "../components/AppLogo";

export default function NoMatch(): ReactElement {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <AppLogo size="md" color="brand" />
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl mb-3">Oh No!</h1>
          <div className="mb-3">
            We didn&apos;t find a match for <code>{location.pathname}</code>
          </div>
          <div>
            <Link className="text-brand hover:text-brand-lighter" to="/bucket">
              Head back home...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
