import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import { auth, firestoreCollection } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectSettings, setSettings } from "store/settings/settingsSlice";
import * as Yup from "yup";
import Spinner from "./Spinner";

export default function AuthSettings(): ReactElement {
  const [user] = useAuthState(auth);
  const { settings, loading } = useSelector(selectSettings);
  const dispatch = useDispatch();

  const [initalFormData, setInitialFormData] = useState({
    accessKeyId: "",
    secretAccessKey: "",
  });

  useEffect(() => {
    if (!loading && settings?.auth && user) {
      setInitialFormData(settings.auth);
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
            const { accessKeyId, secretAccessKey } = values;
            await firestoreCollection
              .doc(user?.uid)
              .set({ auth: { accessKeyId, secretAccessKey } }, { merge: true });
            dispatch(
              setSettings({
                ...settings,
                auth: { accessKeyId, secretAccessKey },
              })
            );
          }}
        >
          {(props) => (
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <form onSubmit={props.handleSubmit} noValidate>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Auth Settings
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="accessKeyId"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Access Key Id
                        </label>
                        <div className="mt-1">
                          <Field name="accessKeyId">
                            {({ field }: FieldProps) => (
                              <div>
                                <input
                                  type="text"
                                  id="accessKeyId"
                                  className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                  {...field}
                                />
                                <ErrorMessage
                                  className="text-sm text-red-600"
                                  name="accessKeyId"
                                >
                                  {(msg) => (
                                    <div className="text-sm text-red-600">
                                      {msg}
                                    </div>
                                  )}
                                </ErrorMessage>
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="secretAccessKey"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Secret Access Key
                        </label>
                        <div className="mt-1">
                          <Field name="secretAccessKey">
                            {({ field }: FieldProps) => (
                              <div>
                                <input
                                  type="text"
                                  id="secretAccessKey"
                                  className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                  {...field}
                                />
                                <ErrorMessage
                                  className="text-sm text-red-600"
                                  name="secretAccessKey"
                                >
                                  {(msg) => (
                                    <div className="text-sm text-red-600">
                                      {msg}
                                    </div>
                                  )}
                                </ErrorMessage>
                              </div>
                            )}
                          </Field>
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
