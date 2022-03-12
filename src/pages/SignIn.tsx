import { faEthereum, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import {
  signInWithCustomToken,
  signInWithPopup,
  UserInfo,
} from "firebase/auth";
import Fortmatic from "fortmatic";
import { auth, googleAuthProvider } from "lib/firebase";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";
import Head from "../components/Head";
import { selectUser, setUser } from "../store/user/userSlice";

const { VITE_FORT_MATIC_KEY, VITE_PORTIS_KEY, VITE_WALLETCONNECT_KEY } =
  import.meta.env;
export default function SignIn(): ReactElement {
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const dispatch = useDispatch();
  const { email } = useSelector(selectUser);
  const users: any = {};
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  const getWeb3Modal = async () => {
    return new Web3Modal({
      network: "mainnet",
      cacheProvider: false,
      providerOptions: {
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: VITE_FORT_MATIC_KEY, // required
          },
        },
        portis: {
          package: Portis, // required
          options: {
            id: VITE_PORTIS_KEY, // required
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: VITE_WALLETCONNECT_KEY,
          },
        },
      },
    });
  };

  const signInEther = async () => {
    const web3Modal = await getWeb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const accounts = await provider.listAccounts();
    let ens_name = await provider.lookupAddress(accounts[0] as string);
    let ens_avatar = "";
    if (ens_name != null) {
      ens_avatar = (await provider.getAvatar(ens_name as any)) as string;
    } else {
      ens_name = "";
    }
    let getNonce = {};
    let getToken = {};
    let response = await fetch(
      "https://us-central1-storj-utropic-services.cloudfunctions.net/getNonceToSign",
      {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: accounts[0] as string,
          displayname: ens_name as string,
          avatar: ens_avatar as string,
        }),
      }
    );
    if (response.status == 200) {
      getNonce = await response.json();
      const signer = provider.getSigner();
      const signature = await signer.signMessage(
        (getNonce as any).nonce.toString()
      );

      response = await fetch(
        "https://us-central1-storj-utropic-services.cloudfunctions.net/verifySignedMessage",
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: accounts[0] as string,
            signature: signature,
          }),
        }
      );
      if (response.status == 200) {
        getToken = await response.json();
        setAccount(accounts[0]);
        localStorage.setItem("meta", accounts[0]);
        await signInWithCustomToken(auth, (getToken as any).token.toString());
      }
    } else {
      console.log("firebase function error");
    }
  };

  useEffect(() => {
    if (account) {
      dispatch(
        setUser({
          email: account,
          displayName: account,
        } as UserInfo)
      );
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (email) navigate("/settings");
  }, [email, navigate]);

  return (
    <>
      <Head title="Sign In | Box Lite" />
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="mx-auto w-3/4">
            <h1 className="font-mono uppercase text-5xl font-light text-center">
              Box Lite
            </h1>
            {/* <Logo variant="color" /> */}
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
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div></div>
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => signInEther()}
                >
                  <span className="sr-only">Sign in with Google</span>
                  <FontAwesomeIcon icon={faEthereum} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
