import React, { ReactElement, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../lib/firebase";

export default function SignIn(): ReactElement {
  const history = useHistory();

  useEffect(() => {
    async function signOut() {
      await auth.signOut();
      history.push("/sign-in");
    }
    signOut();
  }, [history]);

  return <></>;
}
