import { ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { auth, firestoreCollection } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import Head from "../components/Head";
import { Api } from "../lib/api";

export default function Home(): ReactElement {
  const [user] = useAuthState(auth);
  const history = useHistory();
  const [data, setData] = useState<ListObjectsV2CommandOutput>();
  const [apiClient, setApiClient] = useState<Api>();

  useEffect(() => {
    async function loadSettings() {
      const document = await firestoreCollection.doc(user?.uid).get();
      const data = document.data();
      if (data?.auth?.accessKeyId && data?.auth?.secretAccessKey) {
        const { accessKeyId, secretAccessKey } = data.auth;
        setApiClient(new Api(String(accessKeyId), String(secretAccessKey)));
      } else {
        history.push("/settings");
      }
    }
    loadSettings();
  }, [user, history]);

  useEffect(() => {
    async function listDirectories() {
      const parameters = {
        Delimiter: "/",
        Prefix: "",
      };
      const response = await apiClient?.listDirectories(
        parameters.Delimiter,
        parameters.Prefix
      );
      setData(response);
    }
    if (apiClient) {
      listDirectories();
    }
  }, [apiClient]);

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
