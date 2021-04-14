import firebase from "firebase/app";
import React, { ReactElement } from "react";
import Spinner from "./Spinner";

interface Properties {
  error?: Error | firebase.auth.Error;
}
export default function LoadingOrError({ error }: Properties): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {error && <h1 className="text-xl">{error.message}</h1>}
      {!error && <Spinner size="2x" />}
    </div>
  );
}

LoadingOrError.defaultProps = {
  error: undefined,
};
