import {
  faBars,
  faCloud,
  faCogs,
  faIdCard,
  faSignOutAlt,
  faTimes,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { auth } from "lib/firebase";
import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { selectSettings } from "store/settings/settingsSlice";
import { Logo } from "../components/logo/index";
import UserAvatar from "../components/UserAvatar";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface NavigationItem {
  name: string;
  href: string;
  icon?: IconDefinition;
}

interface AppLayoutProps {}

export default function AppLayout({
  children,
}: PropsWithChildren<AppLayoutProps>) {
  const { settings, loading } = useSelector(selectSettings);
  const [user] = useAuthState(auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState<NavigationItem[]>();
  const [userNavigation, setUserNavigation] = useState<NavigationItem[]>();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const navigationItems: NavigationItem[] = [
        {
          name: "Storj DCS",
          href: "/bucket",
          icon: faCloud,
        },
        ...(settings &&
        settings.credentialProfiles &&
        settings.credentialProfiles.length > 0
          ? settings.credentialProfiles.map((cp) => ({
              name: cp.nickname,
              href: `/storj-dcs/${cp.id}`,
              icon: faCloud,
            }))
          : []),
        {
          name: "Settings",
          href: "/settings",
          icon: faCogs,
        },
      ];
      setNavigation(navigationItems);
      const userNavigationItems: NavigationItem[] = [
        { name: "Your Profile", href: "/profile", icon: faIdCard },
        { name: "Sign out", href: "/sign-out", icon: faSignOutAlt },
      ];
      setUserNavigation(userNavigationItems);
    }
  }, [loading, settings]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-secondary">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <FontAwesomeIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                      icon={faTimes}
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 flex items-center px-4">
                <Link
                  to="/bucket"
                  className="h-8 w-auto"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Logo variant="white" />
                </Link>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation &&
                    navigation.map((item, itemIndex) => (
                      <Link
                        key={`n-${itemIndex}-${item.name}`}
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-secondary-dark text-white"
                            : "text-gray-100 hover:bg-secondary-lighter",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {item.icon && (
                          <FontAwesomeIcon
                            icon={item.icon}
                            className="mr-4 h-6 w-6 text-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        {item.name}
                      </Link>
                    ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-secondary md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link
                to="/bucket"
                className="h-8 w-auto"
                onClick={() => setSidebarOpen(false)}
              >
                <Logo variant="white" />
              </Link>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation &&
                  navigation.map((item, itemIndex) => (
                    <Link
                      key={`n-${itemIndex}-${item.name}`}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? "bg-secondary-dark text-white"
                          : "text-gray-100 hover:bg-secondary-lighter",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.icon && (
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="mr-3 h-6 w-6 text-gray-300"
                          aria-hidden="true"
                        />
                      )}
                      {item.name}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <FontAwesomeIcon
              className="h-6 w-6"
              aria-hidden="true"
              icon={faBars}
            />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* <div className="w-full flex items-center md:ml-0">
                {location &&
                  location.pathname &&
                  location.pathname.startsWith("/bucket") && <BucketSelector />}
              </div> */}
              {/* <form className="w-full flex md:ml-0" action="#" method="GET">
                <label htmlFor="search_field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <FontAwesomeIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                      icon={faSearch}
                    />
                  </div>
                  <input
                    id="search_field"
                    className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form> */}
            </div>
            {user && (
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  {({ open }) => (
                    <>
                      <div>
                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span className="sr-only">Open user menu</span>
                          <UserAvatar user={user} />
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                          {userNavigation &&
                            userNavigation.map((item, itemIndex) => (
                              <Menu.Item key={`un-${itemIndex}-${item.name}`}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.icon && (
                                      <FontAwesomeIcon
                                        icon={item.icon}
                                        className="mr-4 text-gray-500"
                                        aria-hidden="true"
                                      />
                                    )}
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
