import FullPageLayout from "layouts/FullPageLayout";
import MainLayout from "layouts/MainLayout";
import React, { ReactElement, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingOrError from "../components/LoadingOrError";
import { auth } from "../lib/firebase";
import PrivateRoute from "../lib/PrivateRoute";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Profile from "./Profile";
import Settings from "./Settings";
import SignIn from "./SignIn";

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
                <MainLayout>
                  <Home />
                </MainLayout>
              </PrivateRoute>
              <PrivateRoute path="/profile">
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
              <PrivateRoute path="/settings">
                <MainLayout>
                  <Settings />
                </MainLayout>
              </PrivateRoute>

              <Route path="/sign-in">
                <FullPageLayout>
                  <SignIn />
                </FullPageLayout>
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
