import {
  faCloud,
  faCog,
  faCogs,
  faIdCard,
  faSignOutAlt,
  faUserCog,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { MenuAlt1Icon, XIcon } from "@heroicons/react/outline";
import { SelectorIcon } from "@heroicons/react/solid";
import UserAvatar from "components/UserAvatar";
import { auth } from "lib/firebase";
import { getProfileName, getProfileType } from "lib/utils";
import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { selectSettings } from "store/settings/settingsSlice";
import { Logo } from "../components/logo/index";

const userMenu = [
  {
    items: [
      { name: "Your Profile", href: "/profile", icon: faIdCard },
      { name: "Settings", href: "/settings", icon: faCogs },
    ],
  },
  {
    items: [{ name: "Sign out", href: "/sign-out", icon: faSignOutAlt }],
  },
];

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
  const [profiles, setProfiles] = useState<NavigationItem[]>();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      const profileItems = [
        ...(settings &&
        settings.credentialProfiles &&
        settings.credentialProfiles.length > 0
          ? settings.credentialProfiles.map((cp) => ({
              name: cp.nickname,
              href: `/p/${getProfileType(cp.type)}/${getProfileName(
                cp.nickname
              )}`,
              icon: cp.type === "storjDcs" ? faCloud : faUserCog,
            }))
          : []),
        { name: "Manage Profiles", href: "/settings", icon: faCog },
      ];
      setProfiles(profileItems);
    }
  }, [loading, settings]);

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 lg:hidden"
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
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
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
                <nav className="px-2">
                  <div className="mt-8">
                    <h3
                      className="px-3 text-xs font-semibold text-gray-100 uppercase tracking-wider"
                      id="teams-headline"
                    >
                      Profiles
                    </h3>
                    <div
                      className="mt-1 space-y-1"
                      role="group"
                      aria-labelledby="teams-headline"
                    >
                      {profiles &&
                        profiles.map((profile, profileIndex) => (
                          <Link
                            key={`pmm-${profileIndex}-${profile.name}`}
                            to={profile.href}
                            className={classNames(
                              location.pathname === profile.href
                                ? "bg-secondary-dark text-white"
                                : "text-gray-100 hover:bg-secondary-lighter",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-secondary-lighter"
                            )}
                            onClick={() => setSidebarOpen(false)}
                            aria-current={
                              location.pathname === profile.href
                                ? "page"
                                : undefined
                            }
                          >
                            {profile.icon && (
                              <FontAwesomeIcon
                                icon={profile.icon}
                                className="mr-3 h-6 w-6 text-gray-300"
                                aria-hidden="true"
                              />
                            )}
                            {profile.name}
                          </Link>
                        ))}
                    </div>
                  </div>
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
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-secondary">
          <div className="flex items-center flex-shrink-0 px-6">
            <Link
              to="/bucket"
              className="h-8 w-auto"
              onClick={() => setSidebarOpen(false)}
            >
              <Logo variant="white" />
            </Link>
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            <Menu
              as="div"
              className="px-3 mt-6 relative inline-block text-left"
            >
              {({ open }) => (
                <>
                  <div>
                    {user && (
                      <Menu.Button className="group w-full bg-secondary rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-100 hover:bg-secondary-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-secondary-lighter">
                        <span className="flex w-full justify-between items-center">
                          <span className="flex min-w-0 items-center justify-between space-x-3">
                            <UserAvatar user={user} />
                            <span className="flex-1 flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">
                                {user.displayName}
                              </span>
                              <span className="text-gray-400 text-sm truncate">
                                {user.email}
                              </span>
                            </span>
                          </span>
                          <SelectorIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-100"
                            aria-hidden="true"
                          />
                        </span>
                      </Menu.Button>
                    )}
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
                      className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                    >
                      {userMenu &&
                        userMenu.map((userMenuItem, userMenuItemIndex) => (
                          <div
                            className="py-1"
                            key={`umd-${userMenuItemIndex}`}
                          >
                            {userMenuItem.items &&
                              userMenuItem.items.map((item, itemIndex) => (
                                <Menu.Item
                                  key={`umd-${itemIndex}-${item.name}`}
                                >
                                  {({ active }) => (
                                    <Link
                                      to={item.href}
                                      className={classNames(
                                        active ? "bg-gray-200" : "",
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
                          </div>
                        ))}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            {/* Navigation */}
            <nav className="px-3 mt-6">
              <div className="mt-8">
                {/* Secondary navigation */}
                <h3
                  className="px-3 text-xs font-semibold text-gray-100 uppercase tracking-wider"
                  id="teams-headline"
                >
                  Profiles
                </h3>
                <div
                  className="mt-1 space-y-1"
                  role="group"
                  aria-labelledby="teams-headline"
                >
                  {profiles &&
                    profiles.map((profile, profileIndex) => (
                      <Link
                        key={`pmm-${profileIndex}-${profile.name}`}
                        to={profile.href}
                        className={classNames(
                          location.pathname === profile.href
                            ? "bg-secondary-dark text-white"
                            : "text-gray-100 hover:bg-secondary-lighter",
                          "group flex items-center px-2 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary-dark focus:ring-secondary-lighter"
                        )}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={
                          location.pathname === profile.href
                            ? "page"
                            : undefined
                        }
                      >
                        {profile.icon && (
                          <FontAwesomeIcon
                            icon={profile.icon}
                            className="mr-3 h-6 w-6 text-gray-300"
                            aria-hidden="true"
                          />
                        )}
                        {profile.name}
                      </Link>
                    ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Search header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:secondary-lighter lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex pr-4">{/* Search? */}</div>
            <div className="flex items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                {({ open }) => (
                  <>
                    <div>
                      {user && (
                        <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:secondary-lighter">
                          <span className="sr-only">Open user menu</span>
                          <UserAvatar user={user} />
                        </Menu.Button>
                      )}
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
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                      >
                        {userMenu &&
                          userMenu.map((userMenuItem, userMenuItemIndex) => (
                            <div
                              className="py-1"
                              key={`umm-${userMenuItemIndex}`}
                            >
                              {userMenuItem.items &&
                                userMenuItem.items.map((item, itemIndex) => (
                                  <Menu.Item
                                    key={`umm-${itemIndex}-${item.name}`}
                                  >
                                    {({ active }) => (
                                      <Link
                                        to={item.href}
                                        className={classNames(
                                          active ? "bg-gray-200" : "",
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
                            </div>
                          ))}
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
