import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth } from "../lib/firebase";
import { resetSettings } from "../store/settings/settingsSlice";
import { resetUser } from "../store/user/userSlice";

export default function SignIn(): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    async function signOut() {
      await auth.signOut();
      dispatch(resetSettings());
      dispatch(resetUser());
      history.push("/sign-in");
    }
    signOut();
  }, [history]);

  return <></>;
}
