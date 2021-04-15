import React, { PropsWithChildren, ReactElement, useEffect } from "react";
import { useParams } from "react-router";
import Head from "../components/Head";

interface MainProps {}

function Main({ children }: PropsWithChildren<MainProps>): ReactElement {
  const { folderPath } = useParams<{ folderPath: string }>();

  useEffect(() => {
    console.log("folderPATH", folderPath);
  }, [folderPath]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
  );
}

export default function Home(): ReactElement {
  const { folderPath } = useParams<{ folderPath: string }>();

  return (
    <>
      <Head title="Home | Storj Box Lite" />
      <Main>
        <pre>folderPath: {folderPath}</pre>
      </Main>
    </>
  );
}
