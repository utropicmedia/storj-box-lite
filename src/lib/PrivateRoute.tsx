/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { auth } from "./firebase";

export default function PrivateRoute({
  children,
  ...rest
}: RouteProps): ReactElement {
  const [user] = useAuthState(auth);
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
