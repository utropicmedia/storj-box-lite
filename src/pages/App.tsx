import firebase from "firebase/app";
import FullPageLayout from "layouts/FullPageLayout";
import React, { ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { setSettings, SettingsState } from "store/settings/settingsSlice";
import { setUser, UserState } from "store/user/userSlice";
import LoadingOrError from "../components/LoadingOrError";
import AppLayout from "../layouts/AppLayout";
import { auth, firestoreCollection } from "../lib/firebase";
import PrivateRoute from "../lib/PrivateRoute";
import Home from "./Home";
import NoMatch from "./NoMatch";
import Profile from "./Profile";
import Settings from "./Settings";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadUserDocument(user: firebase.User) {
      const userDocument = await firestoreCollection.doc(user.uid).get();
      const data = userDocument.data();
      dispatch(setSettings(data as SettingsState));
    }
    if (user) {
      loadUserDocument(user);
      dispatch(setUser(user.toJSON() as UserState));
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
