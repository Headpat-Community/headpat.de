"use client";
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  PhotoIcon,
  FolderIcon,
  HomeIcon,
  XMarkIcon,
  ArrowUpOnSquareIcon,
  ArrowLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

const navigation = [
  { name: "Startseite", href: "/", icon: HomeIcon, current: false },
  { name: "Dashboard", href: "/account", icon: UserCircleIcon, current: false },
  {
    name: "Bild hochladen",
    href: "/account/upload",
    icon: ArrowUpOnSquareIcon,
    current: false,
  },
  {
    name: "User Gallerie",
    href: "/account/gallery",
    icon: PhotoIcon,
    current: false,
  },
  {
    name: "Projekte (Soon)",
    href: "#",
    icon: FolderIcon,
    current: false,
  },
  {
    name: "Ausloggen",
    href: "/account/logout",
    icon: ArrowLeftIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AccountLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userMeData, setUserMeData] = useState(null);

  const getAvatarImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the user data from the API
        const userResponse = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });

        if (userResponse.status === 401) {
          window.location.href = "/login";
        }

        const userResponseData = await userResponse.json();
        // Set the userMeData state to the attributes object of the API response
        setUserMeData(userResponseData);

        const userDataResponse = await fetch(`/api/user/getUserDataSelf`, {
          method: "GET",
        });

        const userDataResponseData = await userDataResponse.json();
        // Set the userData state to the attributes object of the API response
        setUserData(userDataResponseData.documents[0]);
      } catch (error) {
        console.error(error);
      }
    };
    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, []);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-9 lg:hidden"
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
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <Link href="/">
                        <Image
                          className="h-8 w-auto"
                          src="/logos/logo-512.webp"
                          alt="Headpat Community"
                          width={32}
                          height={32}
                        />
                      </Link>
                      <ThemeToggle />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-50 text-indigo-600"
                                      : "text-light-color hover:text-indigo-600 hover:bg-gray-100",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-9 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-20 shrink-0 items-center">
              <Link href="/">
                <Image
                  className="h-12 w-auto mr-4"
                  src="/logos/logo-512.webp"
                  alt="Headpat Community"
                  width={64}
                  height={64}
                />
              </Link>
              <ThemeToggle />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-indigo-600"
                              : "text-light-color hover:text-indigo-600 hover:bg-gray-100",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white"
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {userData ? (
                  <li className="-mx-6 mt-auto">
                    <Link
                      href={`/user/${userData.profileurl}`}
                      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                    >
                      <img
                        className="h-8 w-8 rounded-full bg-gray-800"
                        src={
                          getAvatarImageUrl(userData.avatarId) ||
                          "/logos/logo-512.webp"
                        }
                        alt=""
                        width={32}
                        height={32}
                      />
                      <span className="sr-only">Your profile</span>
                      <span aria-hidden="true">{userData.displayname}</span>
                    </Link>
                  </li>
                ) : (
                  <li className="-mx-6 py-3 mt-auto text-white text-center">
                    Loading...
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div>
          {userData ? (
            <li className="-mx-6 mt-auto">
              <Link
                href={`/user/${userData.profileurl}`}
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
              >
                <img
                  className="h-8 w-8 rounded-full bg-gray-800"
                  src={
                    getAvatarImageUrl(userData.avatarId) ||
                    "/logos/logo-512.webp"
                  }
                  alt=""
                  width={64}
                  height={64}
                />
                <span className="sr-only">Your profile</span>
                <span aria-hidden="true">{userData.displayname}</span>
              </Link>
            </li>
          ) : (
            <li>Loading...</li>
          )}
        </div>

        <main className="lg:pl-72">
          <div className="p-12">{children}</div>
        </main>
      </div>
    </>
  );
}
