import { Formik } from "formik";
import { auth } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import Head from "../components/Head";

export default function Profile(): ReactElement {
  const [user] = useAuthState(auth);
  const [initalFormData, setInitialFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    function initializeFormData() {
      setInitialFormData({
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || "",
      });
    }
    if (user) {
      initializeFormData();
    }
  }, [user]);

  return (
    <>
      <Head title="Profile | Storj Box Lite" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>
      <div className="mt-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Formik
          initialValues={initalFormData}
          enableReinitialize={true}
          validationSchema={Yup.object({
            displayName: Yup.string().required("Display name is required"),
            photoURL: Yup.string(),
          })}
          onSubmit={async (values) => {
            const { displayName, photoURL } = values;
            await user?.updateProfile({ displayName, photoURL });
            await user?.reload();
            setInitialFormData({ displayName, photoURL });
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
                      User Information
                    </h3>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="displayName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Display Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="displayName"
                          id="displayName"
                          autoComplete="name"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.displayName}
                          className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                        {props.errors.displayName && (
                          <div className="text-sm text-red-600">
                            {props.errors.displayName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <div id="email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="photoURL"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Photo URL
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="photoURL"
                          id="photoURL"
                          autoComplete="name"
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          value={props.values.photoURL}
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
