import { Dialog, Transition } from "@headlessui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { Fragment, ReactElement, useRef, useState } from "react";

export interface MintSelectDialogProps {
  title?: ReactElement | string;
  onCancel: () => unknown;
  onConfirm: (chainType: string, name: string, description: string) => unknown;
  open: boolean;
  cancelText?: string;
  confirmText?: string;
  fileUrl: string;
}

export const MintSelectDialog = ({
  title,
  onCancel,
  onConfirm,
  open,
  cancelText,
  confirmText,
  fileUrl,
}: MintSelectDialogProps) => {
  const cancelButtonRef = useRef() as any;
  const [chainType, setChainType] = useState("eth");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleTypeChange = (event: any) => {
    setChainType(event.target.value as string);
  };

  const handleNameChange = (event: any) => {
    setName(event.target.value as string);
  };

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value as string);
  };

  const handleClose = () => {
    setChainType("eth");
    onCancel();
  };

  return (
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

          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 mx-8">
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {title || "Confirm"}
                    </Dialog.Title>
                    <div className="sm:col-span-1 mt-4">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Chain Type
                      </label>
                      <div className="mt-2">
                        <select
                          id="type"
                          name="type"
                          autoComplete="type"
                          className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                          onChangeCapture={handleTypeChange}
                        >
                          <option value="eth">Ethereum</option>
                          <option value="sol">Solana</option>
                        </select>
                      </div>
                      <div className="mt-4 mb-4">
                        {chainType === "sol" ? <WalletMultiButton /> : null}
                      </div>
                    </div>
                    <p className="font-semibold mt-5">Metadata of NFT</p>
                    <div className="col-span-1 sm:col-span-1 mt-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1">
                        <div>
                          <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={handleNameChange}
                            className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1 mt-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <div>
                          <input
                            type="text"
                            id="description"
                            className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                            value={description}
                            onChange={handleDescriptionChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1 mt-2">
                      <label
                        htmlFor="url"
                        className="block text-sm font-medium text-gray-700"
                      >
                        URL
                      </label>
                      <div className="mt-1">
                        <div>
                          <input
                            type="text"
                            id="url"
                            value={fileUrl}
                            disabled
                            className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onConfirm(chainType, name, description)}
                >
                  {confirmText || "Confirm"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleClose}
                  ref={cancelButtonRef}
                >
                  {cancelText || "Cancel"}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default MintSelectDialog;
