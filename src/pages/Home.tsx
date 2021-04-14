import React, { ReactElement, useEffect, useState } from "react";
import Head from "../components/Head";
import { api } from "../lib/api";

export default function Home(): ReactElement {
  const [data, setData] = useState(null);
  useEffect(async () => {
    const parameters = {
      Delimiter: "/",
      Prefix: "",
    };
    const response = await api.listDirectories(
      parameters.Delimiter,
      parameters.Prefix
    );
    console.log(response);
    setData(response);
  }, []);

  return (
    <>
      <Head title="Home | Storj Box Lite" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Home</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <pre className="mt-4 p-4 border-4 border-dashed border-gray-200 rounded-lg">
          data: {data && JSON.stringify(data, undefined, 2)}
        </pre>
      </div>
    </>
  );
}
