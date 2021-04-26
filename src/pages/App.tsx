import React, { ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { getSettings } from "store/settings/settingsSlice";
import { setUser, UserState } from "store/user/userSlice";
import LoadingOrError from "../components/LoadingOrError";
import AppLayout from "../layouts/AppLayout";
import FullPageLayout from "../layouts/FullPageLayout";
import { auth } from "../lib/firebase";
import PrivateRoute from "../lib/PrivateRoute";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Profile from "./Profile";
import Settings from "./Settings";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

// const FullPageLayout = lazy(() => import("../layouts/FullPageLayout"));
// const AppLayout = lazy(() => import("../layouts/AppLayout"));
// const PrivateRoute = lazy(() => import("../lib/PrivateRoute"));
// const Home = lazy(() => import("./Home"));
// const NoMatch = lazy(() => import("./NoMatch"));
// const Profile = lazy(() => import("./Profile"));
// const Settings = lazy(() => import("./Settings"));
// const SignIn = lazy(() => import("./SignIn"));
// const SignOut = lazy(() => import("./SignOut"));

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
                    pathname: user ? "/home" : "/sign-in",
                  }}
                />
              </Route>

              <PrivateRoute path="/home">
                <AppLayout>
                  <Route exact path="/home">
                    <Home />
                  </Route>
                  <Route path="/home/:folderPath">
                    <Home />
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
