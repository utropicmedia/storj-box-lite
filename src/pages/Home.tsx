import { faDownload, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StorjClient } from "lib/storjClient";
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { selectSettings } from "store/settings/settingsSlice";
import Head from "../components/Head";
import Spinner from "../components/Spinner";

interface FolderOrFile {
  key: string;
  type: "file" | "folder";
  originalKey: string | undefined;
}

interface MainProps {}

function Main({ children }: PropsWithChildren<MainProps>): ReactElement {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
  );
}

export default function Home(): ReactElement {
  const { folderPath } = useParams<{ folderPath: string }>();
  const [data, setData] = useState<any>();
  const settings = useSelector(selectSettings);
  const [params, setParams] = useState();

  useEffect(() => {
    if (folderPath) {
      setParams({
        Delimiter: "/",
        Prefix: `${folderPath}/`,
      });
    } else {
      setParams({
        Delimiter: "/",
        Prefix: "/",
      });
    }
  }, [folderPath]);

  useEffect(() => {
    async function getBuckets() {
      const { auth } = settings;
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listDirectories(params);
      // const result = {
      //   folders: listBucketsResponse?.CommonPrefixes?.map((cp) => cp.Prefix),
      //   files: listBucketsResponse?.Contents?.filter((c) => {
      //     console.log(c, params.Prefix);
      //     return c.Key !== params.Prefix;
      //   }),
      // };
      const folders =
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
                } as FolderOrFile)
            )
          : [];
      const results: FolderOrFile[] = [...folders, ...files];
      setData(results);
    }
    if (
      params &&
      settings &&
      settings.auth &&
      settings.auth.accessKeyId &&
      settings.auth.secretAccessKey
    ) {
      getBuckets();
    }
  }, [settings, params, folderPath]);

  return (
    <>
      <Head title="Home | Storj Box Lite" />
      <Main>
        {params && (
          <nav className="flex mb-3" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <Link
                    to="/home"
                    className="text-gray-400 hover:text-gray-500"
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
                        className="flex-shrink-0 h-5 w-5 text-gray-300"
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
        {!data && <Spinner />}
        {/* {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
        {data && data.length > 0 && (
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody>
                {data.map((f: FolderOrFile, fIdx: number) => (
                  <tr
                    className={fIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    key={`f-${f.key}}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {f.type === "folder" && (
                        <Link
                          className="text-indigo-600 hover:text-indigo-500"
                          to={`/home/${f.key.substring(0, f.key.length - 1)}`}
                        >
                          {f.key}
                        </Link>
                      )}
                      {f.type === "file" && f.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {f.type === "file" && (
                        <button
                          type="button"
                          onClick={() => console.log("download", f.originalKey)}
                        >
                          <FontAwesomeIcon
                            className="flex-shrink-0"
                            aria-hidden="true"
                            icon={faDownload}
                          />
                          <span className="sr-only">Download</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Main>
    </>
  );
}
