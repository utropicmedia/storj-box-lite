import { faEthereum, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { signInWithPopup, UserInfo } from "firebase/auth";
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
    const userether = await authenticate(accounts[0] as string);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(userether.nonce.toString());
    const data = await verify(accounts[0], signature);
    console.log(data);
    setAccount(accounts[0]);
    localStorage.setItem("meta", accounts[0]);
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

  const authenticate = async (address: string) => {
    try {
      let userether = users[address];
      if (!userether) {
        userether = {
          address,
          nonce: Math.floor(Math.random() * 10000000),
        };
        users[address] = userether;
      } else {
        userether.nonce = Math.floor(Math.random() * 10000000);
        users[address] = userether;
      }
      return userether;
    } catch (error) {
      throw error;
    }
  };

  const verify = async (address: string, signature: string) => {
    try {
      let authenticated = false;
      const userether = users[address];
      const decodedAddress = ethers.utils.verifyMessage(
        userether.nonce.toString(),
        signature
      );
      if (address?.toString().toLowerCase() === decodedAddress.toLowerCase())
        authenticated = true;
      return authenticated;
    } catch (error) {
      throw error;
    }
  };

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
