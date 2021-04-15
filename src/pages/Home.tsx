import { StorjClient } from "lib/storjClient";
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectSettings } from "store/settings/settingsSlice";
import Head from "../components/Head";

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

  useEffect(() => {
    async function getBuckets() {
      const { auth } = settings;
      const storjClient = StorjClient.getInstance(auth);
      const listBucketsResponse = await storjClient?.listDirectories();
      setData(listBucketsResponse);
    }
    if (
      settings &&
      settings.auth &&
      settings.auth.accessKeyId &&
      settings.auth.secretAccessKey
    ) {
      getBuckets();
    }
  }, [settings]);

  return (
    <>
      <Head title="Home | Storj Box Lite" />
      <Main>
        <pre>folderPath: {folderPath}</pre>
        {data && <pre>data: {JSON.stringify(data, null, 2)}</pre>}
      </Main>
    </>
  );
}
