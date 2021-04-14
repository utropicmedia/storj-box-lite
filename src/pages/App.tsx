import FullPageLayout from "layouts/FullPageLayout";
import React, { ReactElement, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingOrError from "../components/LoadingOrError";
import AppLayout from "../layouts/AppLayout";
import { auth } from "../lib/firebase";
import PrivateRoute from "../lib/PrivateRoute";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Profile from "./Profile";
import Settings from "./Settings";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      {(loading || error) && <LoadingOrError error={error} />}
      {!loading && (
        <BrowserRouter>
          <Suspense fallback={<LoadingOrError />}>
            <Switch>
              <Route exact path="/">
                <Redirect
                  to={{
                    pathname: user ? "/home" : "/sign-in",
                  }}
                />
              </Route>

              <PrivateRoute path="/home">
                <AppLayout>
                  <Home />
                </AppLayout>
              </PrivateRoute>
              <PrivateRoute path="/profile">
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PrivateRoute>
              <PrivateRoute path="/settings">
                <AppLayout>
                  <Settings />
                </AppLayout>
              </PrivateRoute>

              <Route path="/sign-in">
                <FullPageLayout>
                  <SignIn />
                </FullPageLayout>
              </Route>
              <Route path="/sign-out">
                <SignOut />
              </Route>
              <Route path="*">
                <FullPageLayout>
                  <NoMatch />
                </FullPageLayout>
              </Route>
            </Switch>
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}
