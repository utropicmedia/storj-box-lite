import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import React, { Fragment, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { auth, firestoreCollection } from "../lib/firebase";
import {
  CredentialProfile,
  CredentialProfileType,
  selectSettings,
  setSettings
} from "../store/settings/settingsSlice";
import Spinner from "./Spinner";

export interface UpdateCredentialProfileButtonProps {
  onSave?: () => unknown;
}

const DEFAULT_INITIAL_VALUES: CredentialProfile = {
  nickname: "",
  id: "",
  type: "storjDcs",
  credentials: { accessKeyId: "", secretAccessKey: "" },
};

export const UpdateCredentialProfileButton = ({
  onSave,
}: UpdateCredentialProfileButtonProps) => {
  const [user] = useAuthState(auth);
  const { settings, loading } = useSelector(selectSettings);
  const [open, setOpen] = useState(false);
  const [initialValues, setInitalValues] = useState<CredentialProfile>(
    DEFAULT_INITIAL_VALUES
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(true);
  };

  // TODO: Set initial values when updating
  // useEffect(() => {
  //   setInitalValues(DEFAULT_INITIAL_VALUES);
  // }, []);

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
            onClick={() => handleClick()}
          >
            <span className="-ml-0.5 mr-2">
              <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
            </span>{" "}
            Add
          </button>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              static
              className="fixed z-10 inset-0 overflow-y-auto"
              open={open}
              onClose={setOpen}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize={true}
                      validationSchema={Yup.object({
                        nickname: Yup.string().required("Nickname is required"),
                        type: Yup.string().required("Type is required"),
                        credentials: Yup.object().when("type", {
                          is: (val: CredentialProfileType) =>
                            val === "storjDcs",
                          then: Yup.object({
                            accessKeyId: Yup.string().required(
                              "Access key id is required"
                            ),
                            secretAccessKey: Yup.string().required(
                              "Secret access key is required"
                            ),
                          }),
                        }),
                      })}
                      onSubmit={async (values) => {
                        const credentialProfiles = [
                          ...(settings &&
                          settings.credentialProfiles &&
                          settings.credentialProfiles.length > 0
                            ? settings.credentialProfiles
                            : []),
                          values,
                          {
                            ...values,
                            // id:
                            //   settings &&
                            //   settings.credentialProfiles &&
                            //   settings.credentialProfiles.length > 0
                            //     ? settings.credentialProfiles.length
                            //     : 0,
                            id: uuidv4(),
                          },
                        ];
                        await firestoreCollection
                          .doc(user?.uid)
                          .set({ credentialProfiles }, { merge: true });
                        dispatch(
                          setSettings({
                            auth: settings?.auth,
                            credentialProfiles,
                          })
                        );
                        setOpen(false);
                        onSave && onSave();
                      }}
                      validateOnBlur={false}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit} noValidate>
                          <div className="mb-2">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Add Credential Profile
                            </h3>
                          </div>

                          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                            <div className="col-span-1 sm:col-span-1">
                              <label
                                htmlFor="nickname"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Nickname
                              </label>
                              <div className="mt-1">
                                <Field name="nickname">
                                  {({ field }: FieldProps) => (
                                    <div>
                                      <input
                                        type="text"
                                        id="nickname"
                                        className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                        {...field}
                                      />
                                      <ErrorMessage
                                        className="text-sm text-red-600"
                                        name="nickname"
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

                            <div className="sm:col-span-1">
                              <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Type
                              </label>
                              <div className="mt-1">
                                <select
                                  id="type"
                                  name="type"
                                  autoComplete="type"
                                  className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                >
                                  <option value="storjDcs">Storj S3</option>
                                </select>
                              </div>
                            </div>

                            {props.values.type === "storjDcs" && (
                              <>
                                <div className="col-span-1 sm:col-span-1">
                                  <label
                                    htmlFor="credentials.accessKeyId"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Access Key Id
                                  </label>
                                  <div className="mt-1">
                                    <Field name="credentials.accessKeyId">
                                      {({ field }: FieldProps) => (
                                        <div>
                                          <input
                                            type="password"
                                            id="credentials.accessKeyId"
                                            className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                            {...field}
                                          />
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name="credentials.accessKeyId"
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

                                <div className="col-span-1 sm:col-span-1">
                                  <label
                                    htmlFor="credentials.secretAccessKey"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Secret Access Key
                                  </label>
                                  <div className="mt-1">
                                    <Field name="credentials.secretAccessKey">
                                      {({ field }: FieldProps) => (
                                        <div>
                                          <input
                                            type="password"
                                            id="credentials.secretAccessKey"
                                            className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                            {...field}
                                          />
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name="credentials.secretAccessKey"
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
                              </>
                            )}

                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={() => setOpen(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </>
      )}
    </>
  );
};

export default UpdateCredentialProfileButton;
