import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
  faFileAlt,
  faFolder,
  faHome,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import format from "date-fns/format";
import filesize from "filesize";
import { StorjClient } from "lib/storjClient";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import {
  BucketItem,
  getBucketItems,
  selectBucket,
} from "store/bucket/bucketSlice";
import { AuthSettings, selectAuthSettings } from "store/settings/settingsSlice";
import { ConfirmDialog } from "./ConfirmDialog";
import IconButton from "./IconButton";
import Spinner from "./Spinner";
import { PageTitle } from "./typography";

export interface BucketContentsProps {
  bucket: string;
}

const getPrefix = (bucket: string, pathname: string) => {
  const prefix = pathname.replace(`/bucket/${bucket}`, "").replace(/^\//, "");
  return prefix;
};

const getFolderLink = (key: string, bucket: string) => {
  return `/bucket/${bucket}/${key.substring(0, key.length - 1)}`;
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
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbLink[]>();

  useEffect(() => {
    function getBreadcrumbs() {
      const bc: BreadcrumbLink[] = [
        {
          icon: faHome,
          title: "Buckets",
          url: "/bucket",
        },
        {
          title: bucket,
          url: `/bucket/${bucket}`,
        },
      ];
      if (prefix) {
        const parts = prefix.split("/");
        if (parts && parts.length > 0) {
          let url = `/bucket/${bucket}`;
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
  }, [bucket, prefix]);

  return (
    <div>
      <nav className="sm:hidden" aria-label="Back">
        <Link
          to={`/bucket`}
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
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
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
  const authSettings = useSelector(selectAuthSettings);
  const { items, error, loading } = useSelector(selectBucket);
  const dispatch = useDispatch();

  const downloadFile = async (key: string) => {
    if (authSettings && bucketName) {
      const storjClient = StorjClient.getInstance(authSettings);
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

  // TODO: Create a folder
  const createFolder = async (name: string, prefix: string | undefined) => {
    if (authSettings && bucketName) {
      const storjClient = StorjClient.getInstance(authSettings);
      const r = await storjClient?.createFolder(bucketName, name, prefix);
      dispatch(
        getBucketItems({ auth: authSettings, bucket: bucketName, prefix })
      );
    }
  };

  useEffect(() => {
    async function loadBucketContents(auth: AuthSettings) {
      dispatch(getBucketItems({ auth, bucket: bucketName, prefix }));
    }
    if (authSettings?.accessKeyId && authSettings?.secretAccessKey) {
      loadBucketContents(authSettings);
    }
  }, [authSettings, bucketName, prefix, dispatch]);

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
                  This folder is empty.
                </td>
              </tr>
            </tbody>
          )}
          {!loading && items && items.length > 0 && (
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
                        <Link to={getFolderLink(item.key, bucketName)}>
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
                        authSettings={authSettings as AuthSettings}
                        bucketName={bucketName}
                        item={item}
                        prefix={String(prefix)}
                      />
                    )}
                    {item.type === "file" && (
                      <>
                        <IconButton
                          text="Download"
                          icon={faDownload}
                          size="sm"
                          onClick={() => downloadFile(item.key)}
                        />
                        <DeleteFileButton
                          authSettings={authSettings as AuthSettings}
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
}: BucketContentsProps): ReactElement => {
  const location = useLocation();
  const [prefix, setPrefix] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const authSettings = useSelector(selectAuthSettings);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      async function uploadFiles() {
        setUploading(true);
        const storjClient = StorjClient.getInstance(authSettings);
        if (storjClient) {
          await storjClient.uploadFiles({
            files: acceptedFiles,
            bucket,
            prefix,
          });
          setUploading(false);
        }
      }
      if (
        acceptedFiles &&
        acceptedFiles.length > 0 &&
        authSettings?.accessKeyId &&
        authSettings?.secretAccessKey
      ) {
        uploadFiles();
      }
    },
    [authSettings, bucket, prefix]
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

  useEffect(() => {
    if (bucket && location?.pathname) {
      setPrefix(getPrefix(bucket, location.pathname));
    }
  }, [bucket, location]);

  return (
    <>
      <Breadcrumbs bucket={bucket} prefix={prefix} />
      <div className="mt-2 mb-4 md:flex md:items-center md:justify-between">
        <PageTitle>{bucket}</PageTitle>
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lighter"
          >
            <span className="-ml-0.5 mr-2">
              <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
            </span>{" "}
            Create Folder
          </button>
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
    </>
  );
};

export default BucketContents;
