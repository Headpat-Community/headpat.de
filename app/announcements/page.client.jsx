"use client";
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Image from "next/image";

export default function AnnouncementsPage() {
  const [announcementData, setAnnouncementData] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch("/api/announcements/getAnnouncements?populate=*", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncementData(data.data.reverse());
        const createdByIds = data.data.map(
          (announcement) =>
            announcement.attributes.users_permissions_user.data.id
        );
        const fetchPromises = createdByIds.map((createdById) =>
          fetch(`/api/user/getUserData/${createdById}?populate=*`, {
            method: "GET",
          })
            .then((response) => response.json())
            .then((data) => {
              setUserData((prevUserData) => ({
                ...prevUserData,
                [createdById]: data.data,
              }));
            })
        );
        return Promise.all(fetchPromises);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <h1 className="text-4xl text-center mt-4">Announcements</h1>
      <ul
        role="list"
        className="divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 dark:ring-white/95 ring-black/95 sm:rounded-xl mb-4 mt-8 max-w-4xl mx-auto"
      >
        {announcementData &&
          announcementData.map((announcement) => {
            const createdBy =
              userData[announcement.attributes.createdby]?.attributes;
            return (
              <li
                key={announcement.id}
                className="relative flex justify-between gap-x-6 px-4 py-5 dark:hover:bg-gray-50/10 hover:bg-gray-50/90 sm:px-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <Image
                    className="h-12 w-12 flex-none rounded-full"
                    src={
                      createdBy?.avatar?.data?.attributes?.url ||
                      "/logos/logo-64.webp"
                    }
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6">
                      <Link href={`/announcements/${announcement.id}`}>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {announcement.attributes.title}
                      </Link>
                    </p>
                    <p className="mt-1 flex text-xs leading-5 dark:text-gray-300 text-gray-400">
                      {announcement.attributes.sidetext}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    {announcement.attributes.validuntil ? (
                      <>
                        <p className="mt-1 text-xs leading-5 dark:text-white/80 text-black/80">
                          Valid until{" "}
                          <time dateTime={announcement.attributes.validuntil}>
                            {new Date(
                              announcement.attributes.validuntil
                            ).toLocaleDateString()}
                          </time>
                        </p>
                        {new Date(announcement.attributes.validuntil) >
                        new Date() ? (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 dark:text-white/80 text-black/80">
                              Active
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-red-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            <p className="text-xs leading-5 dark:text-white/80 text-black/80">
                              Inactive
                            </p>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                  <ChevronRightIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
}
