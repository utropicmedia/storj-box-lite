import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { resetSettings } from "../store/settings/settingsSlice";
import { resetUser } from "../store/user/userSlice";

export default function SignIn(): ReactElement {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function signOut() {
      await auth.signOut();
      dispatch(resetSettings());
      dispatch(resetUser());
      localStorage.removeItem("meta");
      navigate("/sign-in");
    }
    signOut();
  }, [navigate, dispatch]);

  return <></>;
}
