import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React, { lazy, ReactElement, Suspense } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LoadingOrError from "../components/LoadingOrError";

const {
  VITE_FIREBASE_API_KEY: apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: authDomain,
  VITE_FIREBASE_DATABASE_URL: databaseURL,
  VITE_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  VITE_FIREBASE_PROJECT_ID: projectId,
  VITE_FIREBASE_STORAGE_BUCKET: storageBucket,
} = import.meta.env;

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  messagingSenderId,
  projectId,
  storageBucket,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const PrivateRoute = lazy(() => import("../lib/PrivateRoute"));
const SignIn = lazy(() => import("./SignIn"));
const SignUp = lazy(() => import("./SignUp"));

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <>
      {loading && <LoadingOrError error={error} />}
      {!loading && (
        <BrowserRouter>
          <Suspense fallback={<LoadingOrError />}>
            <Switch>
              <Route exact path="/">
                <MainLayout>
                  <Redirect
                    to={{
                      pathname: user ? "/home" : "/sign-in",
                    }}
                  />
                </MainLayout>
              </Route>
              {/* TODO: Figure out the routing, so we don't reload the layout over and over */}
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
              <Route path="/sign-in" component={SignIn} />
              <Route path="/sign-up" component={SignUp} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}
