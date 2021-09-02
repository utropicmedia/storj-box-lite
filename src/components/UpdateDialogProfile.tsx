import { Dialog, Transition } from "@headlessui/react";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import { auth, firestoreCollection } from "lib/firebase";
import {
  default as React,
  Fragment,
  ReactElement,
  useRef,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  CredentialProfile,
  CredentialProfileType,
  selectSettings,
  setSettings,
} from "store/settings/settingsSlice";
import * as Yup from "yup";

export interface ConfirmDialogProps {
  accessKeyProfile?: ReactElement | string;
  secretKeyProfile?: ReactElement | string;
  content?: ReactElement | string;
  onCancel: () => unknown;
  index: number;
  open: boolean;
  cancelText?: string;
  confirmText?: string;
}
const DEFAULT_INITIAL_VALUES: CredentialProfile = {
  nickname: "",
  id: "",
  type: "storjDcs",
  credentials: { accessKeyId: "", secretAccessKey: "" },
};

export const ConfirmDialog = ({
  onCancel,
  index,
  open,
}: ConfirmDialogProps) => {
  const [initialValues] = useState<CredentialProfile>(DEFAULT_INITIAL_VALUES);
  const { settings, loading } = useSelector(selectSettings);
  const [user] = useAuthState(auth);

  const cancelButtonRef = useRef() as any;
  const dispatch = useDispatch();

  return (
    <>
      {!loading && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed z-10 inset-0 overflow-y-auto"
            initialFocus={cancelButtonRef}
            open={open}
            onClose={() => {}}
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
                        is: (val: CredentialProfileType) => val === "storjDcs",
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
                      const geAlltProfiles: any = settings?.credentialProfiles;
                      const updateProfileData: any = [];
                      var key: any;
                      for (key in geAlltProfiles) {
                        if (key !== index) {
                          updateProfileData.push(geAlltProfiles[key]);
                        } else {
                          values.id = geAlltProfiles[key].id;
                          updateProfileData.push(values);
                        }
                      }
                      const credentialProfiles = [
                        ...(updateProfileData &&
                        updateProfileData &&
                        updateProfileData.length > 0
                          ? updateProfileData
                          : []),
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
                      onCancel();
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
                                      // value={content}
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
                                <option value="storjDcs">Storj DCS</option>
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
                                          // value={accessKey}
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
                                          // value={secretKey}
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
                              onClick={() => onCancel()}
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
      )}
    </>
  );
};

export default ConfirmDialog;
