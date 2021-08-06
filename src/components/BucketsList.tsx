import format from "date-fns/format";
import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBuckets, selectBuckets } from "../store/buckets/bucketsSlice";
import {
  AuthSettings,
  selectAuthSettings,
} from "../store/settings/settingsSlice";
import Spinner from "./Spinner";
import { PageTitle } from "./typography";

export const BucketsList = (): ReactElement => {
  const authSettings = useSelector(selectAuthSettings);
  const { buckets, error, loading } = useSelector(selectBuckets);
  const dispatch = useDispatch();

  useEffect(() => {
    async function getBucketsList(auth: AuthSettings) {
      dispatch(getBuckets(auth));
    }
    if (authSettings?.accessKeyId && authSettings?.secretAccessKey) {
      getBucketsList(authSettings);
    }
  }, [authSettings, dispatch]);

  return (
    <>
      <div className="mt-2 mb-4 md:flex md:items-center md:justify-between">
        <PageTitle>
          Buckets{" "}
          {buckets && <span className="font-normal">({buckets.length})</span>}
        </PageTitle>
      </div>
      {!loading && error && (
        <pre className="mb-4">error: {JSON.stringify(error, null, 2)}</pre>
      )}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created Date
              </th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  colSpan={5}
                >
                  <Spinner />
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (!buckets || buckets.length <= 0) && (
            <tbody>
              <tr>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  colSpan={5}
                >
                  You have no buckets.
                </td>
              </tr>
            </tbody>
          )}
          {!loading && buckets && buckets.length > 0 && (
            <tbody>
              {buckets.map((bucket, bucketIndex) => (
                <tr
                  className={bucketIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  key={`f-${bucket.Name}}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/bucket/${bucket.Name}`}>{bucket.Name}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {bucket.CreationDate
                      ? format(
                          new Date(bucket.CreationDate),
                          "MMM d, yyyy h:mm bbb"
                        )
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default BucketsList;
