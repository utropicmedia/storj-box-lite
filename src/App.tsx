import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingOrError from "./components/LoadingOrError";
import { auth } from "./lib/firebase";
import { getSettings } from "./store/settings/settingsSlice";
import { setUser, UserState } from "./store/user/userSlice";

const FullPageLayout = lazy(() => import("./layouts/FullPageLayout"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const PrivateRoute = lazy(() => import("./lib/PrivateRoute"));
const BucketPage = lazy(() => import("./pages/BucketPage"));
const NoMatch = lazy(() => import("./pages/NoMatch"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignOut = lazy(() => import("./pages/SignOut"));

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user.toJSON() as UserState));
      dispatch(getSettings(user));
    }
  }, [user, dispatch]);

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
                    pathname: user ? "/bucket" : "/sign-in",
                  }}
                />
              </Route>

              <PrivateRoute path="/bucket">
                <AppLayout>
                  <Route exact path="/bucket">
                    <BucketPage />
                  </Route>
                  <Route path="/bucket/:bucketName">
                    <BucketPage />
                  </Route>
                </AppLayout>
              </PrivateRoute>
              <PrivateRoute exact path="/profile">
                <AppLayout>
                  <Profile />
                </AppLayout>
              </PrivateRoute>
              <PrivateRoute exact path="/settings">
                <AppLayout>
                  <Settings />
                </AppLayout>
              </PrivateRoute>

              <Route exact path="/sign-in">
                <FullPageLayout>
                  <SignIn />
                </FullPageLayout>
              </Route>
              <Route exact path="/sign-out">
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
