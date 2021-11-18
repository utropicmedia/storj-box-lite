import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
  faCubes,
  faDownload,
  faFileAlt,
  faFolder,
  faHome,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
// import splToken from "@solana/spl-token";
import * as splToken from "@solana/spl-token";
import {
  useConnection,
  useWallet as useSolWallet,
} from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import format from "date-fns/format";
import filesize from "filesize";
import { ErrorMessage, Field, FieldProps, Formik } from "formik";
import { StorjClient } from "lib/storjClient";
import { getProfileCredentials } from "lib/utils";
import React, {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  BucketItem,
  getBucketItems,
  selectBucket,
} from "store/bucket/bucketSlice";
import {
  AuthSettings,
  selectCredentialProfiles,
} from "store/settings/settingsSlice";
import { useWallet } from "use-wallet";
import Web3 from "web3";
import * as Yup from "yup";
import StorjToken from "../abi/StorjToken.json";
import { ConfirmDialog } from "./ConfirmDialog";
import IconButton from "./IconButton";
import MintSelectDialog from "./MintSelectDialog";
import { SolanaWalletProvider } from "./SolanaWalletProvider";
import Spinner from "./Spinner";
import { PageTitle } from "./typography";

const { VITE_ETHEREUM_MINT_CONTRACT_ADDR } = import.meta.env;

export interface BucketContentsProps {
  bucket: string;
}

const getFolderLink = (
  key: string,
  bucket: string,
  profile: string,
  profileType: string
) => {
  return `/p/${profileType}/${profile}/${bucket}/${key.substring(
    0,
    key.length - 1
  )}`;
};

const getItemName = (key: string, prefix: string | undefined) => {
  const name = prefix ? key.replace(`${prefix}/`, "") : key;
  return name.replace(/\/$/, "");
};

interface BreadcrumbsProps {
  bucket: string;
  prefix: string | undefined;
}

interface BreadcrumbLink {
  icon?: IconDefinition;
  title: string;
  url?: string;
}

const Breadcrumbs = ({ bucket, prefix }: BreadcrumbsProps) => {
  const { profile, type: profileType } = useParams();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbLink[]>();

  useEffect(() => {
    function getBreadcrumbs() {
      const bc: BreadcrumbLink[] = [
        {
          icon: faHome,
          title: "Buckets",
          url: `/p/${profileType}/${profile}`,
        },
        {
          title: bucket,
          url: `/p/${profileType}/${profile}/${bucket}`,
        },
      ];
      if (prefix) {
        const parts = prefix.split("/");
        if (parts && parts.length > 0) {
          let url = `/p/${profileType}/${profile}/${bucket}`;
          parts.forEach((part) => {
            url += `/${part}`;
            bc.push({
              title: part,
              url,
            });
          });
        }
      }
      setBreadcrumbs(bc);
    }
    if (bucket) {
      getBreadcrumbs();
    }
  }, [bucket, profile, profileType, prefix]);

  return (
    <div>
      <nav className="sm:hidden" aria-label="Back">
        <Link
          to={`/p/${profileType}/${profile}`}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon
            className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
            icon={faChevronLeft}
          />
          Back
        </Link>
      </nav>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="hidden sm:flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            {breadcrumbs.map((bc, bcIndex) => (
              <li key={`bc-${bcIndex}-${bc.title}`}>
                <div className="flex items-center">
                  {bc.icon && bc.url && (
                    <Link
                      to={bc.url}
                      className={`${
                        bcIndex > 0 && "ml-4"
                      } text-sm font-medium text-gray-500 hover:text-gray-700`}
                    >
                      <FontAwesomeIcon
                        className="flex-shrink-0"
                        aria-hidden="true"
                        icon={bc.icon}
                      />
                      <span className="sr-only">{bc.title}</span>
                    </Link>
                  )}
                  {!bc.icon && (
                    <>
                      {bcIndex < breadcrumbs.length && (
                        <FontAwesomeIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                          icon={faChevronRight}
                        />
                      )}
                      {bc.url && bcIndex < breadcrumbs.length - 1 ? (
                        <Link
                          to={bc.url}
                          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                          {bc.title}
                        </Link>
                      ) : (
                        <span className="ml-4 text-sm font-medium text-gray-500">
                          {bc.title}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
};

interface MintFileButtonProps {
  authSettings: AuthSettings;
  bucketName: string;
  item: BucketItem;
  prefix: string;
}

const MintFileButton = ({
  authSettings,
  bucketName,
  item,
  prefix,
}: MintFileButtonProps) => {
  const [open, setOpen] = useState(false);
  const { connection } = useConnection();
  const { publicKey } = useSolWallet();
  // TODO: Using any as this was failing to build, as connect expects a string
  const wallet: any = useWallet();
  const mintFile = async (key: string, chainType: string) => {
    setOpen(false);
    const storjClient = StorjClient.getInstance(authSettings);
    if (storjClient) {
      const url = await storjClient.getObjectUrl(bucketName, key);

      if (chainType === "eth") {
        wallet.connect();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const publicKey = accounts[0];
        // console.log(publicKey);
        // console.log(String(VITE_ETHEREUM_MINT_CONTRACT_ADDR));
        const mintContractAddr = String(VITE_ETHEREUM_MINT_CONTRACT_ADDR);
        const web3 = new Web3(window.ethereum);
        // TODO: Using any as it was yelling about setProvider, and the StorjToken wasn't right
        const mintContract: any = new web3.eth.Contract(
          StorjToken as any,
          mintContractAddr
        );
        mintContract.setProvider(window.ethereum);
        const tx = await mintContract.methods
          .mint(url)
          .send({ from: publicKey });
        // console.log(tx.events.Transfer.returnValues.tokenId);
        alert("succesfully minted");
      } else {
        const fromWallet = web3.Keypair.generate();
        // console.log(connection);
        const fromAirDropSignature = await connection.requestAirdrop(
          fromWallet.publicKey,
          web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);

        let mint = await splToken.Token.createMint(
          connection,
          fromWallet,
          fromWallet.publicKey,
          null,
          9,
          splToken.TOKEN_PROGRAM_ID
        );
        let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
          fromWallet.publicKey
        );

        if (publicKey != null) {
          const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
            publicKey
          );

          await mint.mintTo(
            fromTokenAccount.address,
            fromWallet.publicKey,
            [],
            1000000000
          );

          await mint.setAuthority(
            mint.publicKey,
            null,
            "MintTokens",
            fromWallet.publicKey,
            []
          );

          const transaction = new web3.Transaction().add(
            splToken.Token.createTransferInstruction(
              splToken.TOKEN_PROGRAM_ID,
              fromTokenAccount.address,
              toTokenAccount.address,
              fromWallet.publicKey,
              [],
              1
            )
          );
          const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [fromWallet],
            { commitment: "confirmed" }
          );
          alert("Successfully minted. Transaction ID " + signature);
        } else {
          alert("Connect with wallet");
        }
      }
    }
  };

  return (
    <>
      <IconButton
        className="ml-1"
        text="Mint NFT"
        icon={faCubes}
        onClick={() => setOpen(true)}
      />
      <MintSelectDialog
        confirmText="Mint NFT"
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={(chainType) => mintFile(item.key, chainType)}
        title="Mint NFT"
      />
    </>
  );
};

interface DeleteButtonProps {
  authSettings: AuthSettings;
  bucketName: string;
  item: BucketItem;
  prefix: string;
}

const DeleteFileButton = ({
  authSettings,
  bucketName,
  item,
  prefix,
}: DeleteButtonProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const deleteFile = async (key: string) => {
    setOpen(false);
    const storjClient = StorjClient.getInstance(authSettings);
    await storjClient?.deleteFile(bucketName, key);
    dispatch(
      getBucketItems({ auth: authSettings, bucket: bucketName, prefix })
    );
  };

  return (
    <>
      <IconButton
        className="ml-1"
        text="Delete"
        icon={faTrashAlt}
        onClick={() => setOpen(true)}
      />
      <ConfirmDialog
        confirmText="Delete"
        content={
          <span>
            Are you sure you want to delete{" "}
            <span className="font-medium italic">
              {getItemName(item.key, prefix)}
            </span>
            ?
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteFile(item.key)}
        title="Delete File"
      />
    </>
  );
};

const DeleteFolderButton = ({
  authSettings,
  bucketName,
  item,
  prefix,
}: DeleteButtonProps) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const deleteFolder = async (key: string) => {
    setOpen(false);
    const storjClient = StorjClient.getInstance(authSettings);
    await storjClient?.deleteFolder(bucketName, key);
    dispatch(
      getBucketItems({ auth: authSettings, bucket: bucketName, prefix })
    );
  };

  return (
    <>
      <IconButton
        className="ml-1"
        text="Delete"
        icon={faTrashAlt}
        onClick={() => setOpen(true)}
      />
      <ConfirmDialog
        confirmText="Delete"
        content={
          <span>
            Are you sure you want to delete{" "}
            <span className="font-medium italic">
              {getItemName(item.key, prefix)}
            </span>{" "}
            and all of its contents?
          </span>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => deleteFolder(item.key)}
        title="Delete Folder"
      />
    </>
  );
};

interface BucketContentsTableProps {
  bucket: string;
  prefix: string | undefined;
}

const BucketContentsTable = ({
  bucket: bucketName,
  prefix,
}: BucketContentsTableProps) => {
  const { profile, type: profileType } = useParams();
  const credentialSettings = useSelector(selectCredentialProfiles);
  // console.log("credentialSettings", credentialSettings);
  const { items, error, loading } = useSelector(selectBucket);
  const dispatch = useDispatch();
  const [auth, setAuth] = useState<AuthSettings | undefined>();

  const downloadFile = async (key: string) => {
    if (auth && bucketName) {
      const storjClient = StorjClient.getInstance(auth);
      if (storjClient) {
        // TODO: Figure out a better way to handle this, perhaps? Maybe a dialog, with a link once the url has been generated.
        const windowRef = window.open(`/downloading`, "dowloadFile");
        const url = await storjClient.getObjectUrl(bucketName, key);
        if (windowRef) {
          windowRef.location.assign(url);
        }
      }
    }
  };

  useEffect(() => {
    async function loadBucketContents(
      auth: AuthSettings,
      bucket: string,
      prefix: string | undefined
    ) {
      dispatch(getBucketItems({ auth, bucket, prefix }));
    }
    if (auth && bucketName) {
      loadBucketContents(auth, bucketName, prefix);
    }
  }, [auth, bucketName, prefix, dispatch]);

  useEffect(() => {
    if (profile && credentialSettings) {
      const profileCredentials = getProfileCredentials(
        profile,
        credentialSettings
      );
      setAuth(profileCredentials);
    }
  }, [profile, credentialSettings, setAuth]);

  return (
    <>
      {!loading && error && <pre>error: {JSON.stringify(error, null, 2)}</pre>}
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Updated
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Size
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
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
          {!loading && (!items || items.length <= 0) && (
            <tbody>
              <tr>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  colSpan={5}
                >
                  This bucket is empty.
                </td>
              </tr>
            </tbody>
          )}
          {!loading &&
            profile &&
            profileType &&
            auth &&
            items &&
            items.length > 0 && (
              <tbody>
                {items.map((item, itemIndex) => (
                  <tr
                    className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    key={`f-${item.key}}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.type === "folder" && (
                        <span className="flex items-center">
                          <FontAwesomeIcon
                            className="flex-shrink-0 text-xl mr-4"
                            aria-hidden="true"
                            icon={faFolder}
                          />
                          <Link
                            to={getFolderLink(
                              item.key,
                              bucketName,
                              profile,
                              profileType
                            )}
                          >
                            {getItemName(item.key, prefix)}
                          </Link>
                        </span>
                      )}

                      {item.type === "file" && (
                        <span className="flex items-center">
                          <FontAwesomeIcon
                            className="flex-shrink-0 text-xl mr-4"
                            aria-hidden="true"
                            icon={faFileAlt}
                          />

                          {getItemName(item.key, prefix)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      {item.type === "file" && (
                        <>
                          {item.lastModified
                            ? format(
                                new Date(item.lastModified),
                                "MMM d, yyyy h:mm bbb"
                              )
                            : ""}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      {item.type === "file" && (
                        <>{item.size ? filesize(item.size) : ""}</>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {item.type === "folder" && (
                        <DeleteFolderButton
                          authSettings={auth}
                          bucketName={bucketName}
                          item={item}
                          prefix={String(prefix)}
                        />
                      )}
                      {item.type === "file" && (
                        <>
                          <MintFileButton
                            authSettings={auth}
                            bucketName={bucketName}
                            item={item}
                            prefix={String(prefix)}
                          />
                          <IconButton
                            text="Download"
                            icon={faDownload}
                            size="sm"
                            onClick={() => downloadFile(item.key)}
                          />
                          <DeleteFileButton
                            authSettings={auth}
                            bucketName={bucketName}
                            item={item}
                            prefix={String(prefix)}
                          />
                        </>
                      )}
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

export const BucketContents = ({
  bucket,
  bucket: bucketName,
}: BucketContentsProps): ReactElement => {
  const { profile, "*": prefix } = useParams();
  const [uploading, setUploading] = useState(false);
  const [auth, setAuth] = useState<AuthSettings | undefined>();
  const credentialSettings = useSelector(selectCredentialProfiles);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      async function uploadFiles() {
        setUploading(true);
        const storjClient = StorjClient.getInstance(auth);
        if (storjClient) {
          await storjClient.uploadFiles({
            files: acceptedFiles,
            bucket,
            prefix,
          });
          setUploading(false);
        }
      }
      if (acceptedFiles && acceptedFiles.length > 0 && auth) {
        uploadFiles();
      }
    },
    [auth, bucket, prefix]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const {
    getRootProps: getRootPropsDrop,
    getInputProps: getInputPropsDrop,
    isDragActive: isDragActiveDrop,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const createFolder = async (name: string, prefix: string | undefined) => {
    if (auth && bucketName) {
      const storjClient = StorjClient.getInstance(auth);
      await storjClient?.createFolder(bucketName, name, prefix);
      dispatch(getBucketItems({ auth, bucket: bucketName, prefix }));
    }
  };

  useEffect(() => {
    if (profile && credentialSettings) {
      const profileCredentials = getProfileCredentials(
        profile,
        credentialSettings
      );
      setAuth(profileCredentials);
    }
  }, [profile, credentialSettings, setAuth]);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <SolanaWalletProvider>
      <Breadcrumbs bucket={bucket} prefix={prefix} />
      <div className="mt-2 mb-4 md:flex md:items-center md:justify-between">
        <PageTitle>{bucket}</PageTitle>
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <button
            onClick={() => handleClick()}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
          >
            <span className="-ml-0.5 mr-2">
              <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
            </span>{" "}
            Create Folder
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
                      initialValues={{
                        name: "",
                      }}
                      validationSchema={Yup.object({
                        name: Yup.string().required("Folder Name is required"),
                      })}
                      onSubmit={async (values) => {
                        createFolder(values.name, prefix);
                        setOpen(false);
                      }}
                      validateOnBlur={false}
                    >
                      {(props) => (
                        <form onSubmit={props.handleSubmit} noValidate>
                          <div className="mb-2">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Create New Folder
                            </h3>
                          </div>
                          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                            <div className="col-span-1 sm:col-span-1">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Folder Name
                              </label>
                              <div className="mt-1">
                                <Field name="name">
                                  {({ field }: FieldProps) => (
                                    <div>
                                      <input
                                        type="text"
                                        id="name"
                                        className="shadow-sm focus:ring-brand-lighter focus:border-brand-lighter block w-full sm:text-sm border-gray-300 rounded-md"
                                        {...field}
                                      />
                                      <ErrorMessage
                                        className="text-sm text-red-600"
                                        name="name"
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
                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand text-base font-medium text-white hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                Create
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
          <div
            {...getRootProps()}
            className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter cursor-pointer"
          >
            <span className="-ml-0.5 mr-2">
              <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
            </span>{" "}
            {isDragActive ? <span>Drop</span> : <span>Upload</span>}
            <input {...getInputProps()} multiple={true} disabled={uploading} />
          </div>
        </div>
      </div>
      {uploading && <Spinner />}
      <div {...getRootPropsDrop()} className="relative">
        {isDragActiveDrop && (
          <span className="absolute z-10 w-full h-full bg-brand bg-opacity-50 flex items-center justify-items-center rounded">
            <div className="mx-auto text-3xl font-bold py-4 px-8 bg-gray-900 bg-opacity-50 text-white rounded">
              Drop to upload!
            </div>
          </span>
        )}
        {!uploading && <BucketContentsTable bucket={bucket} prefix={prefix} />}
        <input {...getInputPropsDrop()} multiple={true} disabled={uploading} />
      </div>
    </SolanaWalletProvider>
  );
};

export default BucketContents;
