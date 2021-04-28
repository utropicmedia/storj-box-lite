import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import Head from "../components/Head";
import { Logo } from "../components/logo/index";

export default function NoMatch(): ReactElement {
  const location = useLocation();

  return (
    <>
      <Head title="Page Not Found | Storj Box Lite" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo variant="color" />
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h1 className="text-2xl mb-3">Oh No!</h1>
            <div className="mb-3">
              We didn&apos;t find a match for <code>{location.pathname}</code>
            </div>
            <div>
              <Link
                className="text-brand hover:text-brand-lighter"
                to="/bucket"
              >
                Head back home...
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
