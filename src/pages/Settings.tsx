import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import { auth, firestoreCollection } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import Head from "../components/Head";

interface SettingsDocumentAuth {
  accessKeyId: string;
  secretAccessKey: string;
}

interface SettingsDocument {
  auth: SettingsDocumentAuth;
}

export default function Settings(): ReactElement {
  const [user] = useAuthState(auth);
  const [initalFormData, setInitialFormData] = useState({
    accessKeyId: "",
    secretAccessKey: "",
  });

  useEffect(() => {
    async function getSettings() {
      const document = await firestoreCollection.doc(user?.uid).get();
      const data = document.data() as SettingsDocument;
      if (data?.auth) {
        const { accessKeyId, secretAccessKey } = data.auth;
        setInitialFormData({ accessKeyId, secretAccessKey });
      }
    }
    getSettings();
  }, [user]);

  return (
    <>
      <Head title="Settings | Storj Box Lite" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="mt-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
          }}
        >
          {(props) => (
            <form
              className="space-y-8 divide-y divide-gray-200"
              onSubmit={props.handleSubmit}
              noValidate
            >
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Storj Settings
                    </h3>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
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
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
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
              <div className="pt-5">
                <div className="flex justify-end">
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
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
}
