import { User } from "@firebase/auth";
import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import LoadingOrError from "./components/LoadingOrError";
import AppLayout from "./layouts/AppLayout";
import FullPageLayout from "./layouts/FullPageLayout";
import { auth } from "./lib/firebase";
import { getSettings } from "./store/settings/settingsSlice";
import { setUser, UserState } from "./store/user/userSlice";
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
            <Routes>
              <Route path="/" element={<Layout user={user} />}>
                <Route
                  path=""
                  element={
                    <Navigate
                      to={{
                        pathname: user ? "settings" : "sign-in",
                      }}
                    />
                  }
                ></Route>
                <Route
                  path="p/:type"
                  element={
                    <RequireAuth>
                      <StorjDcs />
                    </RequireAuth>
                  }
                >
                  <Route
                    path=":profile"
                    element={
                      <RequireAuth>
                        <StorjDcs />
                      </RequireAuth>
                    }
                  >
                    <Route
                      path=":bucketName/*"
                      element={
                        <RequireAuth>
                          <StorjDcs />
                        </RequireAuth>
                      }
                    />
                  </Route>
                </Route>
                <Route
                  path="settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />

                <Route path="sign-in" element={<SignIn />} />
                <Route path="sign-out" element={<SignOut />} />
                <Route path="downloading" element={<LoadingOrError />} />

                <Route path="*" element={<NoMatch />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      )}
    </>
  );
}

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [user] = useAuthState(auth);
  return user ? children : <Navigate to="/sign-in" />;
};

const Layout: React.FC<{ user: User | null | undefined }> = ({ user }) => {
  if (user) {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }

  return (
    <FullPageLayout>
      <Outlet />
    </FullPageLayout>
  );
};
