"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import AnnouncementNotification from "@/components/announcementNotification";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Pawcraft", href: "/pawcraft" },
  { name: "Users", href: "/users" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const isPawcraftPage = pathname === "/pawcraft";
  const isAnnouncementPage = pathname.startsWith("/announcements");

  useEffect(() => {
    const checkIfUserExists = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/checkUserExists`,
          {
            method: "GET",
          }
        );

        if (response.status === 201) {
          setIsLoggedIn(true);
        } else if (response.status === 401) {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfUserExists();
  }, []);

  return (
    <>
      {!isAnnouncementPage && <AnnouncementNotification />}
      <header
        className={`border-b-2 ${
          isPawcraftPage ? "text-white" : "dark:text-white"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <div className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Headpat Community</span>
              <Link className="mr-4" href="/">
                <Image
                  aria-label="Headpat Logo"
                  title="Headpat Logo"
                  className="h-10 w-auto"
                  src="/logos/Headpat_new_logo.webp"
                  alt=""
                  width={128}
                  height={128}
                />
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 dark:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {isLoggedIn ? (
              <Link
                href="/account"
                className="text-sm font-semibold leading-6 dark:text-white"
              >
                Account <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 dark:text-white"
              >
                Anmelden <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Headpat Community</span>
                <Image
                  className="h-8 w-auto"
                  src="/logos/Headpat_new_logo.webp"
                  alt=""
                  width={128}
                  height={128}
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      Account
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      Anmelden
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
}
