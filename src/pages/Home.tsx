import {
  faFileAlt,
  faFolder,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import { faDownload, faHome, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import format from "date-fns/format";
import filesize from "filesize";
import { StorjClient } from "lib/storjClient";
import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { selectSelectedBucket } from "store/bucket/bucketSlice";
import { AuthSettings, selectSettings } from "store/settings/settingsSlice";
import Head from "../components/Head";
import IconButton from "../components/IconButton";
import Link from "../components/Link";
import Spinner from "../components/Spinner";

interface FolderOrFile {
  key: string;
  type: "file" | "folder";
  originalKey: string | undefined;
  lastModified: Date;
  size: number;
}

interface MainProps {}

function Main({ children }: PropsWithChildren<MainProps>): ReactElement {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
  );
}

export default function Home(): ReactElement {
  const selectedBucket = useSelector(selectSelectedBucket);
  const { folderPath } = useParams<{ folderPath: string }>();
  const [data, setData] = useState<any>();
  const [refresh, setRefresh] = useState<boolean>(true);
  const { settings, loading } = useSelector(selectSettings);
  const [params, setParams] = useState<{
    Bucket: string;
    Delimiter: string;
    Prefix: string;
  }>();
  const history = useHistory();
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Dropped!!!", acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadFile = async (key: string) => {
    if (settings && settings.auth) {
      const storjClient = StorjClient.getInstance(settings.auth);
      if (storjClient && selectedBucket) {
        const url = await storjClient.getObjectUrl(
          key.charAt(0) === "/" ? key.slice(1) : key,
          selectedBucket
        );
        window.open(url, "dowloadFile", "noopener");
      }
    }
  };

  useEffect(() => {
    if (selectedBucket) {
      if (folderPath) {
        setParams({
          Bucket: selectedBucket,
          Delimiter: "/",
          Prefix: `${folderPath}/`,
        });
      } else {
        setParams({
          Bucket: selectedBucket,
          Delimiter: "/",
          Prefix: "/",
        });
      }
    }
  }, [folderPath, selectedBucket]);

  const onUpload = (onUploadData: any) => {
    console.log("onUploadData", onUploadData);
    setRefresh(true);
  };

  const deleteFile = async (key: string) => {
    if (settings && selectedBucket) {
      const storjClient = StorjClient.getInstance(settings.auth);
      const response = await storjClient?.deleteFile(key, selectedBucket);
      console.log("deleteFile", response);
      setRefresh(true);
    }
  };

  useEffect(() => {
    async function listDirectories(auth: AuthSettings) {
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listDirectories(params);
      const folders =
        params &&
        listBucketsResponse &&
        listBucketsResponse.CommonPrefixes &&
        listBucketsResponse.CommonPrefixes.length > 0
          ? listBucketsResponse.CommonPrefixes.map(
              (cp) =>
                ({
                  key: String(cp.Prefix).replace(params.Prefix, ""),
                  type: "folder",
                } as FolderOrFile)
            )
          : [];
      const files =
        params &&
        listBucketsResponse &&
        listBucketsResponse.Contents &&
        listBucketsResponse.Contents.length > 0
          ? listBucketsResponse.Contents.filter(
              (c) => c.Key !== params.Prefix
            ).map(
              (cp) =>
                ({
                  key: String(cp.Key).replace(params.Prefix, ""),
                  type: "file",
                  originalKey: cp.Key,
                  lastModified: cp.LastModified,
                  size: cp.Size,
                } as FolderOrFile)
            )
          : [];
      const results: FolderOrFile[] = [...folders, ...files];
      setData(results);
      setRefresh(false);
    }
    if (!loading) {
      if (!settings?.auth?.accessKeyId || !settings?.auth?.secretAccessKey) {
        history.push("/settings");
      } else if (
        refresh &&
        params &&
        settings &&
        settings.auth &&
        settings.auth.accessKeyId &&
        settings.auth.secretAccessKey
      ) {
        listDirectories(settings.auth);
      }
    }
  }, [loading, settings, params, folderPath, history, refresh]);

  return (
    <>
      <Head title="Home | Storj Box Lite" />
      {selectedBucket && (
        <Main>
          <div className="flex items-center justify-between mb-3">
            {params && (
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <div>
                      <Link
                        to="/home"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FontAwesomeIcon
                          className="flex-shrink-0"
                          aria-hidden="true"
                          icon={faHome}
                        />
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  {params.Prefix.split("/")
                    .filter((v) => !!v)
                    .map((page) => (
                      <li key={page}>
                        <div className="flex items-center">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                          </svg>
                          <Link
                            to={`/home/${page}`}
                            className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                            aria-current={page ? "page" : undefined}
                          >
                            {page}
                          </Link>
                        </div>
                      </li>
                    ))}
                </ol>
              </nav>
            )}
            <div>
              {/* <UploadButton onUpload={(data: any) => onUpload(data)} /> */}
              <div
                {...getRootProps()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="-ml-0.5 mr-2">
                  <FontAwesomeIcon aria-hidden="true" icon={faPlus} />
                </span>{" "}
                {isDragActive ? <span>Drop</span> : <span>Upload</span>}
                <input {...getInputProps()} />
              </div>
            </div>
          </div>

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
              {!data && (
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
              {data && !data.length && (
                <tbody>
                  <tr>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                      colSpan={5}
                    >
                      Nothing to see here!
                    </td>
                  </tr>
                </tbody>
              )}
              {data && data.length > 0 && (
                <tbody>
                  {data.map((f: FolderOrFile, fIdx: number) => (
                    <tr
                      className={fIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      key={`f-${f.key}}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {f.type === "folder" && (
                          <span className="flex items-center">
                            <FontAwesomeIcon
                              className="flex-shrink-0 text-xl mr-4"
                              aria-hidden="true"
                              icon={faFolder}
                            />
                            <Link
                              to={`/home/${f.key.substring(
                                0,
                                f.key.length - 1
                              )}`}
                            >
                              {f.key}
                            </Link>
                          </span>
                        )}
                        {f.type === "file" && (
                          <span className="flex items-center">
                            <FontAwesomeIcon
                              className="flex-shrink-0 text-xl mr-4"
                              aria-hidden="true"
                              icon={faFileAlt}
                            />
                            {f.key}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        {f.type === "file" && (
                          <>{format(f.lastModified, "MMM d, yyyy h:mm bbb")}</>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        {f.type === "file" && <>{filesize(f.size)}</>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {f.type === "file" && (
                          <>
                            <IconButton
                              onClick={() =>
                                downloadFile(String(f.originalKey))
                              }
                              text="Download"
                              icon={faDownload}
                              size="sm"
                            />
                            <IconButton
                              className="ml-1"
                              text="Delete"
                              icon={faTrashAlt}
                              onClick={() => deleteFile(String(f.originalKey))}
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
        </Main>
      )}
    </>
  );
}
