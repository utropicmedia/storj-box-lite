import { useFormik } from "formik";
import { auth, firestore } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import Head from "../components/Head";

const { VITE_FIRESTORE_COLLECTION: firestoreCollection } = import.meta.env;

interface DocumentDataAuth {
  accessKeyId: string;
  secretAccessKey: string;
}

interface DocumentData {
  auth: DocumentDataAuth;
}

export default function Settings(): ReactElement {
  const [user] = useAuthState(auth);
  const [initalFormData, setInitialFormData] = useState({
    accessKeyId: "",
    secretAccessKey: "",
  });

  const userReference = firestore
    .collection(String(firestoreCollection))
    .doc(user?.uid);

  const formik = useFormik({
    initialValues: initalFormData,
    validationSchema: Yup.object({
      accessKeyId: Yup.string().required("Access key id is required"),
      secretAccessKey: Yup.string().required("Secret access key is required"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      const { accessKeyId, secretAccessKey } = values;
      userReference
        .set({ auth: { accessKeyId, secretAccessKey } }, { merge: true })
        .then((response) => {
          console.log("document saved", response);
        })
        .catch((error) => {
          console.error("there was an error saving the document", error);
        });
    },
  });

  const resetForm = () => {
    console.log("initalFormData", initalFormData);
    formik.resetForm({ values: initalFormData });
  };

  useEffect(() => {
    console.log("useEffect");
    userReference
      .get()
      .then((document) => {
        console.log("exists", document.exists, document.metadata);
        const data = document.data() as DocumentData;
        console.log("data", data);
        if (data && data.auth) {
          const { accessKeyId, secretAccessKey } = data.auth;
          setInitialFormData({ accessKeyId, secretAccessKey });
          formik.setValues({ accessKeyId, secretAccessKey }).catch((error) => {
            console.error("there was an error setting the form values", error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Head title="Settings | Storj Box Lite" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      <div className="mt-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <form
          className="space-y-8 divide-y divide-gray-200"
          onSubmit={formik.handleSubmit}
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
                    <input
                      type="text"
                      name="accessKeyId"
                      id="accessKeyId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.accessKeyId}
                      className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                    />
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
                    <input
                      type="text"
                      name="secretAccessKey"
                      id="secretAccessKey"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.secretAccessKey}
                      className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                    />
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
                onClick={() => resetForm()}
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
      </div>
    </>
  );
}
