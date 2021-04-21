import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { selectSettings } from "store/settings/settingsSlice";
import BucketSelector from "./BucketSelector";
import Spinner from "./Spinner";

export default function BucketSettings(): ReactElement {
  const { settings, loading } = useSelector(selectSettings);

  return (
    <>
      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        <form noValidate>
          <div className="shadow sm:rounded-md">
            <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Bucket Settings
                </h3>
              </div>

              {loading && <Spinner />}
              {!loading && settings && <BucketSelector />}
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
            >
              Reset
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
