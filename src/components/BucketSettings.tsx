import { Bucket } from "@aws-sdk/client-s3";
import { Formik } from "formik";
import { auth } from "lib/firebase";
import { StorjClient } from "lib/storjClient";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectSettings, Settings } from "store/settings/settingsSlice";
import * as Yup from "yup";
import Spinner from "./Spinner";

const DefaultBucket = () => {
  const [selected, setSelected] = useState<string>();
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const { settings, loading } = useSelector(selectSettings);

  useEffect(() => {
    async function getBuckets({ auth, defaultBucket }: Settings) {
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listBuckets();
      if (
        listBucketsResponse &&
        listBucketsResponse.Buckets &&
        listBucketsResponse?.Buckets?.length > 0
      ) {
        setBuckets(listBucketsResponse.Buckets);
        const selectedBucket = defaultBucket
          ? defaultBucket
          : listBucketsResponse && listBucketsResponse.Buckets.length > 0
          ? listBucketsResponse.Buckets[0].Name
          : null;
        console.log("selectedBucket", selectedBucket);
      }
    }
    if (
      !loading &&
      settings?.auth?.accessKeyId &&
      settings?.auth?.secretAccessKey
    ) {
      getBuckets(settings);
    }
  }, [loading, settings]);

  return <pre>{JSON.stringify(buckets, null, 2)}</pre>;

  // return <BucketSelector />;
};

export default function BucketSettings(): ReactElement {
  const [user] = useAuthState(auth);
  const { settings, loading } = useSelector(selectSettings);
  const dispatch = useDispatch();

  const [initalFormData, setInitialFormData] = useState({
    defaultBucket: "",
  });

  useEffect(() => {
    if (!loading && settings?.defaultBucket && user) {
      setInitialFormData({ defaultBucket: settings.defaultBucket });
    }
  }, [loading, settings, user]);

  return (
    <>
      {loading && <Spinner />}
      {!loading && settings && (
        <Formik
          initialValues={initalFormData}
          enableReinitialize={true}
          validationSchema={Yup.object({
            accessKeyId: Yup.string().required("Access key id is required"),
            secretAccessKey: Yup.string().required(
              "Secret access key is required"
            ),
          })}
          onSubmit={async (values) => {
            console.log("values", values);
            // const { accessKeyId, secretAccessKey } = values;
            // await firestoreCollection
            //   .doc(user?.uid)
            //   .set({ auth: { accessKeyId, secretAccessKey } }, { merge: true });
            // dispatch(
            //   setSettings({
            //     ...settings,
            //     auth: { accessKeyId, secretAccessKey },
            //   })
            // );
          }}
        >
          {(props) => (
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <form onSubmit={props.handleSubmit} noValidate>
                <div className="shadow sm:rounded-md">
                  <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Bucket Settings
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="accessKeyId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Default Bucket
                        </label>
                        <div className="mt-1">
                          <DefaultBucket />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
                    onClick={() => props.resetForm({ values: initalFormData })}
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
          )}
        </Formik>
      )}
    </>
  );
}
