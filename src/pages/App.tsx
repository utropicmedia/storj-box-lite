import firebase from "firebase/app";
import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import {
  getUserSettings,
  setSettings,
  SettingsState,
} from "store/settings/settingsSlice";
import { setUser, UserState } from "store/user/userSlice";
import LoadingOrError from "../components/LoadingOrError";
import { auth, firestoreCollection } from "../lib/firebase";

const FullPageLayout = lazy(() => import("../layouts/FullPageLayout"));
const AppLayout = lazy(() => import("../layouts/AppLayout"));
const PrivateRoute = lazy(() => import("../lib/PrivateRoute"));
const Home = lazy(() => import("./Home"));
const NoMatch = lazy(() => import("./NoMatch"));
const Profile = lazy(() => import("./Profile"));
const Settings = lazy(() => import("./Settings"));
const SignIn = lazy(() => import("./SignIn"));
const SignOut = lazy(() => import("./SignOut"));

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUserDocument(user: firebase.User) {
      const userDocument = await firestoreCollection.doc(user.uid).get();
      const data = userDocument.data() as SettingsState;
      dispatch(setSettings(data));
    }
    if (user) {
      // loadUserDocument(user);
      dispatch(setUser(user.toJSON() as UserState));
      dispatch(getUserSettings(user));
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
