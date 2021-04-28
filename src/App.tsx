import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingOrError from "./components/LoadingOrError";
import AppLayout from "./layouts/AppLayout";
import FullPageLayout from "./layouts/FullPageLayout";
import { auth } from "./lib/firebase";
import PrivateRoute from "./lib/PrivateRoute";
// import BucketPage from "./pages/BucketPage";
// import NoMatch from "./pages/NoMatch";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import SignIn from "./pages/SignIn";
// import SignOut from "./pages/SignOut";
// import StorjDcs from "./pages/StorjDcs";
import { getSettings } from "./store/settings/settingsSlice";
import { setUser, UserState } from "./store/user/userSlice";

// const FullPageLayout = lazy(() => import("./layouts/FullPageLayout"));
// const AppLayout = lazy(() => import("./layouts/AppLayout"));
// const PrivateRoute = lazy(() => import("./lib/PrivateRoute"));
const BucketPage = lazy(() => import("./pages/BucketPage"));
const NoMatch = lazy(() => import("./pages/NoMatch"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignOut = lazy(() => import("./pages/SignOut"));
const StorjDcs = lazy(() => import("./pages/StorjDcs"));

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

              <PrivateRoute
                path={["/bucket", "/storj-dcs", "/profile", "/settings"]}
              >
                <AppLayout>
                  <Route exact path="/bucket">
                    <BucketPage />
                  </Route>
                  <Route path="/bucket/:bucketName">
                    <BucketPage />
                  </Route>
                  <Route exact path="/storj-dcs">
                    <StorjDcs />
                  </Route>
                  <Route path="/storj-dcs/:profile">
                    <StorjDcs />
                  </Route>
                  <Route path="/storj-dcs/:profile/:bucketName">
                    <StorjDcs />
                  </Route>
                  <Route exact path="/profile">
                    <Profile />
                  </Route>
                  <Route exact path="/settings">
                    <Settings />
                  </Route>
                </AppLayout>
              </PrivateRoute>

              <Route exact path={["/sign-in", "/sign-out", "/downloading"]}>
                <FullPageLayout>
                  <Route exact path="/sign-in">
                    <SignIn />
                  </Route>
                  <Route exact path="/sign-out">
                    <SignOut />
                  </Route>
                  <Route exact path="/downloading">
                    <LoadingOrError />
                  </Route>
                </FullPageLayout>
              </Route>

              <Route path="*">
                {user ? (
                  <AppLayout>
                    <NoMatch />
                  </AppLayout>
                ) : (
                  <FullPageLayout>
                    <NoMatch />
                  </FullPageLayout>
                )}
              </Route>
            </Switch>
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}
