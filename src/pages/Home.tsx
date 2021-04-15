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

interface MainProps {}

function Main({ children }: PropsWithChildren<MainProps>): ReactElement {
  const { folderPath } = useParams<{ folderPath: string }>();

  useEffect(() => {
    console.log("folderPath", folderPath);
  }, [folderPath]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
  );
}

export default function Home(): ReactElement {
  const { folderPath } = useParams<{ folderPath: string }>();
  const [data, setData] = useState<any>();
  const settings = useSelector(selectSettings);
  const [params, setParams] = useState({
    Delimiter: "/",
    Prefix: "",
  });

  useEffect(() => {
    async function getBuckets() {
      const { auth } = settings;
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listDirectories(params);
      const result = {
        folders: listBucketsResponse?.CommonPrefixes?.map((cp) => cp.Prefix),
        files: listBucketsResponse?.Contents?.filter((c) => {
          console.log(c, params.Prefix);
          return c.Key !== params.Prefix;
        }),
      };
      setData(result);
    }
    if (
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
        {!data && <Spinner />}
        {data && (
          <div>
            {data?.folders?.length > 0 &&
              data.folders.map((f: any, key: number) => (
                <div key={`folder-${key}}`}>
                  <Link to={`/home/${f}`}>{f}</Link>
                </div>
              ))}
            {data?.files?.length > 0 &&
              data.files.map((f: any, key: number) => (
                <div key={`file-${key}}`}>{f.Key}</div>
              ))}
          </div>
        )}
        {/* {data && <pre>data: {JSON.stringify(data, null, 2)}</pre>} */}
      </Main>
    </>
  );
}
