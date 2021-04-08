import firebase from "firebase/app";
import React, { ReactElement } from "react";

interface Properties {
  error?: Error | firebase.auth.Error;
}
export default function LoadingOrError({ error }: Properties): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl">{error ? error.message : "Loading..."}</h1>
    </div>
  );
}
LoadingOrError.defaultProps = {
  error: undefined,
};
