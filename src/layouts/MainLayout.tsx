import firebase from "firebase/app";
import { AnimatePresence, motion } from "framer-motion";
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import AppLogo from "../components/AppLogo";

const variants = {
  visible: { translateX: "0%", opacity: 1, width: "auto" },
  hidden: { translateX: "-100%", opacity: 0, width: 0 },
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MainLayoutProperties {}

const menuItems = [
  {
    icon: () => (
      <svg
        className="mr-4 h-6 w-6 text-indigo-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    title: "Home",
    to: "/home",
  },
  {
    icon: () => (
      <svg
        className="mr-4 h-6 w-6 text-indigo-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Settings",
    to: "/settings",
  },
];

export default function MainLayout({
  children,
}: PropsWithChildren<MainLayoutProperties>): ReactElement {
  const [user] = useAuthState(firebase.auth());
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const reference = useRef<HTMLDivElement>(null);

  const signOut = () => firebase.auth().signOut();

  const toggleMobileMenu = () => {
    setMobileMenuIsOpen(!mobileMenuIsOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (reference.current?.contains(event.target as Node)) {
      return;
    }
    setMobileMenuIsOpen(false);
  };

  useEffect(() => {
    if (mobileMenuIsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuIsOpen]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <AnimatePresence>
        {mobileMenuIsOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ type: "tween", ease: "anticipate" }}
            className="fixed inset-0 flex z-40 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={reference}
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              aria-hidden="true"
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-brand">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <Link to="/home" className="h-8 w-auto">
                    <AppLogo color="contrast" />
                  </Link>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={`sm-menu-${item.title}`}
                      to={item.to}
                      className="text-white hover:bg-brand-lighter hover:bg-opacity-75 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                    >
                      <item.icon />
                      {item.title}
                    </Link>
                  ))}

                  <button
                    type="button"
                    key="sm-menu-sign-out"
                    onClick={() => signOut()}
                    className="text-white hover:bg-brand-lighter hover:bg-opacity-75 group flex items-center px-2 py-2 text-base font-medium rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-4 h-6 w-6 text-indigo-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </nav>
              </div>
              {user && (
                <div className="flex-shrink-0 flex border-t border-brand-dark p-4">
                  <Link to="/profile" className="flex-shrink-0 group block">
                    <div className="flex items-center">
                      {user.photoURL && (
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src={user.photoURL}
                            alt=""
                          />
                        </div>
                      )}
                      <div className="ml-3">
                        <p className="text-base font-medium text-white">
                          {user.displayName}
                        </p>
                        <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden bg-brand md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <Link to="/home" className="flex items-center flex-shrink-0 px-4">
                <AppLogo color="contrast" />
              </Link>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={`md-menu-${item.title}`}
                    to={item.to}
                    className="text-white hover:bg-brand-lighter hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  >
                    <item.icon />
                    {item.title}
                  </Link>
                ))}
                <button
                  type="button"
                  key="md-menu-sign-out"
                  onClick={() => signOut()}
                  className="text-white hover:bg-brand-lighter hover:bg-opacity-75 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-4 h-6 w-6 text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </nav>
            </div>
            {user && (
              <div className="flex-shrink-0 flex border-t border-brand-dark p-4">
                <Link
                  to="/profile"
                  className="flex-shrink-0 w-full group block"
                >
                  <div className="flex items-center">
                    {user.photoURL && (
                      <div>
                        <img
                          className="inline-block h-9 w-9 rounded-full"
                          src={user.photoURL}
                          alt=""
                        />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {user.displayName}
                      </p>
                      <p className="text-xs font-medium text-indigo-200 group-hover:text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => toggleMobileMenu()}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <main
          className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div className="py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
