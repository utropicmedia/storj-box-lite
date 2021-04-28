import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth, googleAuthProvider } from "lib/firebase";
import React, { ReactElement, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import Head from "../components/Head";
import { Logo } from "../components/logo/index";

export default function SignIn(): ReactElement {
  const [user] = useAuthState(auth);
  const history = useHistory();

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  useEffect(() => {
    if (user) {
      history.push("/bucket");
    }
  }, [user, history]);

  return (
    <>
      <Head title="Sign In | Storj Box Lite" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto w-3/4">
            <Logo variant="color" />
          </div>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="mt-0">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Sign in with
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div></div>
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => signInWithGoogle()}
                >
                  <span className="sr-only">Sign in with Google</span>
                  <FontAwesomeIcon icon={faGoogle} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
