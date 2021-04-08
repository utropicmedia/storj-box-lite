/* eslint-disable react/jsx-props-no-spreading */
import firebase from "firebase/app";
import React, { ReactElement } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";

export default function PrivateRoute({
  children,
  ...rest
}: RouteProps): ReactElement {
  const [user] = useAuthState(firebase.auth());

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
