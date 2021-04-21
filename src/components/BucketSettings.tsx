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
        <div className="shadow sm:rounded-md sm:overflow-hidden">
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
      </div>
    </>
  );
}
