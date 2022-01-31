import React, { lazy, ReactElement, Suspense, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { getSettings } from "store/settings/settingsSlice";
import LoadingOrError from "./components/LoadingOrError";
import AppLayout from "./layouts/AppLayout";
import FullPageLayout from "./layouts/FullPageLayout";
import { auth } from "./lib/firebase";
import { selectUser, setUser, UserState } from "./store/user/userSlice";
const NoMatch = lazy(() => import("./pages/NoMatch"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfileList = lazy(() => import("./pages/ProfileList"));
const Settings = lazy(() => import("./pages/Settings"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignOut = lazy(() => import("./pages/SignOut"));
const StorjDcs = lazy(() => import("./pages/StorjDcs"));

export default function App(): ReactElement {
  const [user, loading, error] = useAuthState(auth);
  const account = localStorage.getItem("meta");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(setUser(user.toJSON() as UserState));
      dispatch(getSettings(user));
    }

    if (account) {
      dispatch(
        setUser({
          email: account,
          displayName: account,
        } as UserState)
      );
    }
  }, [user, account, dispatch]);

  return (
    <>
      {(loading || error) && <LoadingOrError error={error} />}
      {!loading && (
        <BrowserRouter>
          <Suspense fallback={<LoadingOrError />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <Navigate
                      to={{
                        pathname: user ? "p" : "sign-in",
                      }}
                    />
                  }
                ></Route>

                <Route
                  path="p"
                  element={
                    <RequireAuth>
                      <ProfileList />
                    </RequireAuth>
                  }
                />
                <Route
                  path="p/:type"
                  element={
                    <RequireAuth>
                      <StorjDcs />
                    </RequireAuth>
                  }
                ></Route>
                <Route
                  path="p/:type/:profile"
                  element={
                    <RequireAuth>
                      <StorjDcs />
                    </RequireAuth>
                  }
                ></Route>
                <Route
                  path="p/:type/:profile/:bucketName/*"
                  element={
                    <RequireAuth>
                      <StorjDcs />
                    </RequireAuth>
                  }
                ></Route>

                {/* <Route
                  path="p"
                  element={
                    <RequireAuth>
                      <ProfileList />
                    </RequireAuth>
                  }
                >
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <ProfileList />
                      </RequireAuth>
                    }
                  ></Route>
                  <Route
                    path=":type"
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
                </Route> */}

                <Route
                  path="settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <RequireAuth>
                      <Profile />
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
  const { email } = useSelector(selectUser);
  return email ? children : <Navigate to="/sign-in" />;
};

const Layout = () => {
  const { email } = useSelector(selectUser);
  if (email) {
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
