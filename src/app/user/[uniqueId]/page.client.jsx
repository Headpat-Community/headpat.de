"use client";
import { useEffect, useState, Fragment } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  UserCircleIcon,
  PencilSquareIcon,
  XMarkIcon as XMarkIconMini,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faPersonHalfDress } from "@fortawesome/free-solid-svg-icons";
import {
  faTelegram,
  faDiscord,
  faXTwitter,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import ErrorPage from "@/components/404";
import Image from "next/image";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const activity = [
  {
    id: 1,
    type: "commented",
    person: {
      name: "fafa",
      imageUrl: "/logos/logo.webp",
    },
    comment: "Irgendwann könnt ihr hier auch comments schreiben! :3",
    date: "soon",
    dateTime: "2023-01-23T15:56",
  },
];
const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XMarkIconMini,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [selected, setSelected] = useState(moods[5]);
  const [hasError, setHasError] = useState(false); // Add this state
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);
  const params = useParams();
  const username = params.uniqueId;

  const getAvatarImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`;
  };

  const rawBirthday = userData?.birthday; // ISO date string

  // Parse the ISO date string to a Date object
  const dateObject = new Date(rawBirthday);

  // Format the date as "DD-MM-YYYY"
  const formattedBirthday = `${dateObject
    .getDate()
    .toString()
    .padStart(2, "0")}.${(dateObject.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${dateObject.getFullYear()}`;

  // Check if the formatted birthday is equal to today's date
  const today = new Date();
  const formattedToday = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;

  useEffect(() => {
    if (formattedBirthday !== "31.01.1900") {
      setIsBirthdayToday(formattedBirthday === formattedToday);
    }
  }, [formattedBirthday, formattedToday]);

  useEffect(() => {
    fetch(
      `/api/user/getUserProfileFilter?queries[]=equal("profileurl","${username}")`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.documents[0]);
      })
      .catch((error) => {
        console.error("API error:", error);
        setHasError(true);
      });
  }, [username]);

  return (
    <>
      <main>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            <Transition
              show={isBirthdayToday}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm rounded-lg shadow-lg ring-1 dark:bg-black bg-white dark:ring-black ring-white ring-opacity-5 border dark:border-white border-black">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {userData ? (
                        <Image
                          src={
                            getAvatarImageUrl(userData.avatarId) ||
                            "/logos/logo-512.webp"
                          }
                          alt=""
                          className="rounded-full object-contain"
                          width={64}
                          height={64}
                        />
                      ) : (
                        <Image
                          src="/logos/logo-512.webp"
                          alt=""
                          className="h-10 rounded-full"
                          width={64}
                          height={64}
                        />
                      )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium">
                        {userData?.displayname}
                      </p>
                      <p className="mt-1 text-sm dark:text-gray-300 text-gray-800">
                        It&apos;s their birthday today!
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:ring-transparent"
                        onClick={() => {
                          setIsBirthdayToday(false);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        {userData ? ( // Check if userData exists
          <>
            <header className="relative isolate pt-16">
              <div
                className="absolute inset-0 -z-10 overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
                  <div
                    className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br dark:from-[#FF80B5] dark:to-[#9089FC] from-[#007f4a] to-[#6f7603]"
                    style={{
                      clipPath:
                        "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                    }}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px dark:bg-white/95 bg-black/95" />
              </div>

              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
                  <div className="flex items-center gap-x-6">
                    <div className="mt-1 text-base font-semibold leading-6">
                      <div className="mt-1 text-base font-semibold leading-6">
                        {userData ? (
                          <Image
                            src={
                              getAvatarImageUrl(userData.avatarId) ||
                              "/logos/logo-512.webp"
                            }
                            alt=""
                            className="h-16 w-16 flex-none rounded-full ring-1 dark:ring-white/10 ring-black/10"
                            width={64}
                            height={64}
                          />
                        ) : (
                          <Image
                            src="/logos/logo-512.webp"
                            alt=""
                            className="h-16 w-16 flex-none rounded-full ring-1 dark:ring-white/10 ring-black/10"
                            width={64}
                            height={64}
                          />
                        )}
                      </div>
                    </div>
                    <h1>
                      <div className="mt-1 text-base font-semibold leading-6">
                        {userData?.displayname}
                      </div>
                    </h1>
                  </div>
                  <div className="flex items-center gap-x-4 sm:gap-x-6">
                    {userData?.telegramname && (
                      <Link
                        href={`https://t.me/${userData.telegramname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon
                          icon={faTelegram}
                          className="hover:text-indigo-500 text-2xl"
                        />
                      </Link>
                    )}
                    {userData?.discordname && (
                      <Link
                        href={`https://discord.com/users/${userData.discordname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon
                          icon={faDiscord}
                          className="hover:text-indigo-500 text-2xl"
                        />
                      </Link>
                    )}
                    {userData?.X_name && (
                      <Link
                        href={`https://x.com/${userData.X_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon
                          icon={faXTwitter}
                          className="hover:text-indigo-500 text-2xl"
                        />
                      </Link>
                    )}
                    {userData?.twitchname && (
                      <Link
                        href={`https://twitch.tv/${userData.twitchname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon
                          icon={faTwitch}
                          className="hover:text-indigo-500 text-2xl"
                        />
                      </Link>
                    )}
                    {userData?.furaffinityname && (
                      <Link
                        href={`https://www.furaffinity.net/user/${userData.furaffinityname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 dark:fill-white fill-black hover:fill-indigo-500 dark:hover:fill-indigo-500"
                          viewBox="0 0 220 200"
                        >
                          <path
                            d="M0 0 C1.99954746 -0.04254356 4.00041636 -0.04080783 6 0 C6.495 0.495 6.495 0.495 7 1 C6.99403607 3.50484983 6.94459278 5.99690491 6.875 8.5 C6.76557917 14.96734708 7.41954728 19.97894365 10 26 C13.76921101 25.41754643 16.50622528 24.31230198 19.8125 22.4375 C24.54984238 19.96584311 27.71635874 19.51077396 33 20 C33.4726477 28.19256018 33.4726477 28.19256018 31.5 31.5625 C30.7575 32.2740625 30.7575 32.2740625 30 33 C32.00531205 37.22614829 34.20778508 41.14759487 38 44 C41.02043907 44.31508177 43.00142395 43.77549381 46 43 C46.99 45.475 46.99 45.475 48 48 C52.095613 46.18176822 54.93470721 43.47545937 58.1953125 40.4609375 C60 39 60 39 62 39 C60.65831165 43.48245881 59.34758217 47.66449796 56.8125 51.625 C54.7746625 55.41959397 54.65377698 57.75876802 55 62 C56.12148438 62.18175781 56.12148438 62.18175781 57.265625 62.3671875 C58.25046875 62.53476562 59.2353125 62.70234375 60.25 62.875 C61.22453125 63.03742187 62.1990625 63.19984375 63.203125 63.3671875 C65.77264117 63.94855848 67.72071056 64.70840265 70 66 C69.43454163 69.95820859 68.19097652 72.6659053 66 76 C66.99 76.53625 67.98 77.0725 69 77.625 C69.99 78.40875 70.98 79.1925 72 80 C72.1875 82.8125 72.1875 82.8125 72 86 C73.6457435 90.77127556 73.6457435 90.77127556 76.75 94.625 C78 96 78 96 78.1875 98.3125 C76.32976529 102.51684698 72.75453094 104.51123348 69 107 C69.185625 107.78375 69.37125 108.5675 69.5625 109.375 C70 112 70 112 69 114 C69.66 114 70.32 114 71 114 C70.38461538 119.53846154 70.38461538 119.53846154 68.4375 121.875 C67.963125 122.24625 67.48875 122.6175 67 123 C67.70444647 126.28182137 67.70444647 126.28182137 70.9375 127.5 C72.4534375 128.2425 72.4534375 128.2425 74 129 C76.1519437 132.22791555 76.20086443 133.28400809 76 137 C71.48382401 137.07654536 67.40914783 137.10228696 63 136 C63.825 136.721875 64.65 137.44375 65.5 138.1875 C68 141 68 141 68.3125 143.8125 C68.1578125 144.8953125 68.1578125 144.8953125 68 146 C64.26512223 145.5020163 62.18762365 145.12508244 59 143 C59.37253906 143.66386719 59.74507812 144.32773438 60.12890625 145.01171875 C60.60199219 145.89472656 61.07507813 146.77773437 61.5625 147.6875 C62.03816406 148.55761719 62.51382813 149.42773438 63.00390625 150.32421875 C64.14268368 153.38328753 63.92718689 154.91863039 63 158 C60.6875 158.3125 60.6875 158.3125 58 158 C56.5625 156 56.5625 156 55 153 C53.95821939 151.54741415 52.89430504 150.11052859 51.8125 148.6875 C51.28269531 147.99011719 50.75289062 147.29273438 50.20703125 146.57421875 C49.80871094 146.05472656 49.41039062 145.53523437 49 145 C48.34 147.97 47.68 150.94 47 154 C45.68 154.33 44.36 154.66 43 155 C42.38108782 164.69629086 46.00365745 171.51505741 51.37890625 179.421875 C54.24108233 183.9737695 55.48088926 187.58999585 55 193 C53 195 53 195 50.0625 195.3125 C47 195 47 195 45.40942383 193.76391602 C43.76452018 191.70529332 43.14073941 189.98628276 42.38671875 187.46484375 C42.11134277 186.57716309 41.8359668 185.68948242 41.55224609 184.77490234 C41.12419678 183.37038818 41.12419678 183.37038818 40.6875 181.9375 C36.96735636 169.12905472 36.96735636 169.12905472 28.5703125 159.2578125 C25.87811764 157.70696476 25.87811764 157.70696476 22 158 C20.70042578 160.59914845 21.07211978 162.11854493 21.375 165 C21.47425781 165.97582031 21.57351562 166.95164063 21.67578125 167.95703125 C21.83626953 169.46330078 21.83626953 169.46330078 22 171 C22.18831974 172.89575208 22.37588301 174.79157954 22.5625 176.6875 C22.70782018 178.12505197 22.85345102 179.56257278 23 181 C19.77208445 183.1519437 18.71599191 183.20086443 15 183 C13.14933921 179.09783152 12.87352572 176.28599636 13.125 172 C13.19319667 168.03485089 13.22025055 166.39330455 11.25 162.875 C8.30213551 160.41844626 6.33937774 158.98782384 2.421875 159.0234375 C1.54015625 159.13945312 0.6584375 159.25546875 -0.25 159.375 C-1.14203125 159.48585937 -2.0340625 159.59671875 -2.953125 159.7109375 C-3.96632812 159.85402344 -3.96632812 159.85402344 -5 160 C-8.16315247 168.4470549 -9.29006963 176.84730956 -10.4609375 185.7578125 C-10.61820312 186.87414062 -10.77546875 187.99046875 -10.9375 189.140625 C-11.07027344 190.14641602 -11.20304687 191.15220703 -11.33984375 192.18847656 C-12.07144074 195.30425722 -13.10345455 197.42827507 -15 200 C-17.5625 200.4375 -17.5625 200.4375 -20 200 C-22 198 -22 198 -22.25 194.25 C-22.09389301 186.87694675 -21.3364521 179.00935631 -19 172 C-18.46424427 166.18170294 -18.46424427 166.18170294 -20.875 161.0625 C-22.82597612 158.96116416 -22.82597612 158.96116416 -25 158 C-25.18175781 159.04800781 -25.18175781 159.04800781 -25.3671875 160.1171875 C-25.53476563 161.02726563 -25.70234375 161.93734375 -25.875 162.875 C-26.03742188 163.77992188 -26.19984375 164.68484375 -26.3671875 165.6171875 C-27 168 -27 168 -29 170 C-33.55555556 169.44444444 -33.55555556 169.44444444 -35 168 C-35.07325168 165.13732433 -35.09238205 162.299281 -35.0625 159.4375 C-35.05798828 158.63119141 -35.05347656 157.82488281 -35.04882812 156.99414062 C-35.03700518 154.99606244 -35.01906914 152.99802217 -35 151 C-35.77085938 151.48726562 -36.54171875 151.97453125 -37.3359375 152.4765625 C-40.271917 154.15549506 -41.6833596 154.52368006 -45 154 C-46.6484375 152.4765625 -46.6484375 152.4765625 -48 151 C-48.51046875 151.49628906 -49.0209375 151.99257812 -49.546875 152.50390625 C-54.74933665 157.36507166 -60.00190134 160.94348528 -66.30078125 164.26171875 C-72.19284844 168.05617591 -74.59964775 173.94408327 -77.44335938 180.09179688 C-79.02444403 183.39898737 -79.87577153 184.91718102 -83 187 C-89.45283019 186.54716981 -89.45283019 186.54716981 -92 184 C-92.47957635 178.9164907 -92.07318223 176.06453133 -89 172 C-87.3011973 169.97945436 -85.5716907 167.99645648 -83.8046875 166.03515625 C-82.71185278 164.80276039 -81.64546338 163.54518016 -80.6328125 162.24609375 C-76.01878541 156.36252666 -70.02433392 152.34129546 -64 148 C-62.41376089 146.81638427 -60.82995338 145.6294933 -59.25 144.4375 C-58.16666667 143.625 -57.08333333 142.8125 -56 142 C-56.495 141.566875 -56.99 141.13375 -57.5 140.6875 C-59 139 -59 139 -59 136 C-59.99 135.67 -60.98 135.34 -62 135 C-62.495 131.535 -62.495 131.535 -63 128 C-67.68961314 127.51149863 -70.04494235 127.76364759 -73.9375 130.5 C-78.22414273 133.4298995 -80.85807677 133.68558976 -86 133 C-88.5 131.9375 -88.5 131.9375 -90 130 C-90.5625 126.625 -90.5625 126.625 -90 123 C-87.29339938 119.51422647 -85.71641519 118.16194531 -81.37109375 117.1796875 C-80.07300781 117.07914062 -78.77492188 116.97859375 -77.4375 116.875 C-71.07435592 116.47900352 -71.07435592 116.47900352 -66 113 C-66 112.34 -66 111.68 -66 111 C-67.03125 110.525625 -68.0625 110.05125 -69.125 109.5625 C-69.70507812 109.29566406 -70.28515625 109.02882813 -70.8828125 108.75390625 C-76.59567973 106.71961958 -82.34035231 106.90421575 -88.3125 107 C-91.2139878 107.04544225 -94.09732579 107.04743901 -97 107 C-98 106 -98 106 -98.1875 103.0625 C-98 100 -98 100 -96 98 C-92.94995002 97.81326225 -90.05193349 97.82050341 -87.03125 98.3359375 C-79.77473834 99.55438162 -72.99813244 98.10966277 -66 96 C-65.34 95.34 -64.68 94.68 -64 94 C-63.97746557 91.55036823 -63.97746557 91.55036823 -64.375 88.875 C-64.48585937 87.96492188 -64.59671875 87.05484375 -64.7109375 86.1171875 C-64.80632812 85.41851562 -64.90171875 84.71984375 -65 84 C-64.34 83.67 -63.68 83.34 -63 83 C-63.28284018 81.22773547 -63.57660498 79.457212 -63.875 77.6875 C-64.11863281 76.20830078 -64.11863281 76.20830078 -64.3671875 74.69921875 C-64.88085454 71.79940173 -64.88085454 71.79940173 -67 69 C-67.125 66.3125 -67.125 66.3125 -67 64 C-62.69677317 62.53060547 -58.37702633 61.22556737 -54 60 C-54.1446083 55.22792625 -56.484632 52.93828395 -59.77734375 49.828125 C-63.89699003 46.43973404 -68.43296518 43.73760742 -73 41 C-74.54415812 40.06660937 -76.08614128 39.12960202 -77.625 38.1875 C-78.25664063 37.80980469 -78.88828125 37.43210938 -79.5390625 37.04296875 C-81 36 -81 36 -82 34 C-82.44590164 28.76065574 -82.44590164 28.76065574 -80.9375 26.1875 C-77.78784791 24.25706807 -75.72458038 24 -72 24 C-62.41064201 26.85358058 -55.01985168 34.70191174 -48.30859375 41.78515625 C-46.96193778 43.20609969 -46.96193778 43.20609969 -44.5 43.8125 C-41.07209287 45.44075589 -40.60477325 47.65090799 -39 51 C-36.94906855 52.40466953 -36.94906855 52.40466953 -35 53 C-35.020625 51.700625 -35.04125 50.40125 -35.0625 49.0625 C-35.08399454 47.70834367 -35.07148199 46.35243917 -35 45 C-34 44 -34 44 -31.4375 43.9375 C-30.633125 43.958125 -29.82875 43.97875 -29 44 C-30.84095878 38.49769303 -32.67817273 33.31967922 -35.75 28.375 C-38.47807284 23.76147008 -38.41945277 20.28510485 -38 15 C-35.25 14.6875 -35.25 14.6875 -32 15 C-27.30662236 19.00317504 -25.87530414 25.31245786 -24 31 C-23.505 32.485 -23.505 32.485 -23 34 C-22.34 33.67 -21.68 33.34 -21 33 C-21.9099312 30.33086848 -22.82771766 27.66486389 -23.75 25 C-24.00265625 24.25621094 -24.2553125 23.51242188 -24.515625 22.74609375 C-26.0937372 18.20902116 -27.91084436 13.99354921 -30.21484375 9.77539062 C-31.37174053 7.15942254 -31.28045175 4.80451751 -31 2 C-29.68 1.67 -28.36 1.34 -27 1 C-24.74247336 4.49121726 -23.35185734 7.70529157 -22.1875 11.6875 C-20.23323746 17.73605403 -17.59208869 22.77351095 -14 28 C-13.525625 28.72960937 -13.05125 29.45921875 -12.5625 30.2109375 C-11.14210276 32.16398371 -9.9901019 33.62945813 -8 35 C-4.98557792 35.2839673 -2.98989704 34.77324924 0 34 C0.11644605 25.11128488 -0.05651656 16.32643956 -0.73217773 7.46118164 C-1.10377197 2.20754395 -1.10377197 2.20754395 0 0 Z M7 36 C6.34 37.32 5.68 38.64 5 40 C5.99 39.67 6.98 39.34 8 39 C8.33 38.01 8.66 37.02 9 36 C8.34 36 7.68 36 7 36 Z M27 41 C26.67 42.32 26.34 43.64 26 45 C26.99 45.33 27.98 45.66 29 46 C28.67 44.35 28.34 42.7 28 41 C27.67 41 27.34 41 27 41 Z M-12 50 C-12.64324219 50.66 -13.28648438 51.32 -13.94921875 52 C-18.86926395 57.28105481 -22.06938967 62.22922997 -22.375 69.625 C-22.14844423 75.19449597 -20.13775701 77.78097463 -16.375 81.8125 C-13.11646086 84.36583291 -10.24604889 84.74783761 -6.16796875 84.4609375 C-2.40401733 83.66067395 -0.25261522 81.97644725 2 79 C7.3146633 70.57555769 11.50047784 60.59835926 9.3125 50.5 C7.90808866 46.18770317 7.90808866 46.18770317 5 43 C-2.76679164 41.05037679 -6.91267994 44.52931774 -12 50 Z M19 53 C13.14561089 59.568339 9.94556961 68.50189904 9.5625 77.3125 C10.23198456 82.95529842 11.34964382 87.26043537 15.3125 91.4375 C18.43740757 93.25430673 20.37699126 93.92753983 24 94 C30.04274088 92.27350261 33.48822987 89.18516395 37 84 C39.57569305 76.27292085 39.01295507 65.29178474 35.90625 57.76953125 C34.50662712 55.03664692 33.31160036 53.05475587 31 51 C25.92991612 49.52506651 23.06956947 49.57299413 19 53 Z M-33 63 C-33.33 64.65 -33.66 66.3 -34 68 C-33.01 67.67 -32.02 67.34 -31 67 C-31 65.68 -31 64.36 -31 63 C-31.66 63 -32.32 63 -33 63 Z M-44.81640625 80.64453125 C-48.44151051 84.51422086 -50.09786688 87.51945455 -50 93 C-48.52622626 97.65402233 -47.23163999 100.51812118 -43 103 C-37.6448131 103.81764202 -32.64690569 103.92226719 -27.875 101.25 C-24.40569253 97.08683103 -23.56077852 93.85388866 -23.67578125 88.51953125 C-24.24898798 84.06509338 -25.79308698 79.90453843 -28 76 C-34.54847845 71.6343477 -39.74020542 76.0486591 -44.81640625 80.64453125 Z M46 85 C45.67 86.65 45.34 88.3 45 90 C45.66 90 46.32 90 47 90 C47.33 88.68 47.66 87.36 48 86 C47.34 85.67 46.68 85.34 46 85 Z M-16.4375 99.5625 C-17.05496094 100.16191406 -17.67242187 100.76132813 -18.30859375 101.37890625 C-21.28088566 104.22763868 -23.90822373 105.33493159 -27.8125 106.3125 C-33.4190282 107.9773206 -37.26138439 109.98252427 -40.28515625 115.23046875 C-42.9416315 121.0386943 -43.67999746 125.80730862 -42 132 C-40.57106232 135.65172963 -39.53276952 136.70385759 -36.09765625 138.61328125 C-30.23716357 141.01680976 -23.76102619 140.36412244 -17.53710938 140.26367188 C-10.11132048 140.35643321 -6.46676246 142.10611132 -1 147 C3.43992496 150.09556037 7.51521853 151.90205747 13 152 C17.84447767 150.74711784 20.22805131 149.1301527 22.875 145 C25.88256816 139.74173513 26.87597894 135.0053223 26 129 C24.2559328 125.0863132 21.82086442 121.89548845 18.9375 118.75 C16.90129824 115.85990719 16.14846162 113.55270919 15.125 110.1875 C12.99092846 103.34666198 10.03167509 98.02111673 4 94 C-3.56368816 91.60175741 -10.71736895 94.51656487 -16.4375 99.5625 Z M30.8125 99.125 C29.55373047 100.27355469 29.55373047 100.27355469 28.26953125 101.4453125 C25.41028222 104.66381313 23.33046955 107.80761667 22.6796875 112.125 C23.10498127 116.2078202 24.03352587 118.53317073 27.0625 121.375 C30.97435585 124.29285969 34.12531683 125.53574446 39 126 C42.90465822 124.08450729 45.95454842 121.87559246 48 118 C49.88098684 110.20734022 48.17912981 103.75712036 44.1875 96.875 C42.11692122 94.75570484 42.11692122 94.75570484 39.1875 94.625 C35.16423824 95.09832491 33.74102515 96.37354846 30.8125 99.125 Z"
                            transform="translate(99,0)"
                          />
                          <path
                            d="M0 0 C1.875 0 1.875 0 4 1 C5.23097282 3.35936456 6.12082567 5.50610449 7 8 C7.34289062 8.91394531 7.68578125 9.82789063 8.0390625 10.76953125 C9.05681734 13.50428976 10.06075591 16.23726852 11 19 C11.28617188 19.66644531 11.57234375 20.33289063 11.8671875 21.01953125 C12 23 12 23 10.0625 25.75 C9.381875 26.4925 8.70125 27.235 8 28 C7.76289307 27.43490723 7.52578613 26.86981445 7.28149414 26.28759766 C6.20919546 23.73310421 5.13586047 21.17904747 4.0625 18.625 C3.68931641 17.73554688 3.31613281 16.84609375 2.93164062 15.9296875 C2.57392578 15.07890625 2.21621094 14.228125 1.84765625 13.3515625 C1.51773682 12.56604004 1.18781738 11.78051758 0.84790039 10.97119141 C0.27098397 9.62998117 -0.34705629 8.30588742 -1 7 C-1.125 3.9375 -1.125 3.9375 -1 1 C-0.67 0.67 -0.34 0.34 0 0 Z "
                            transform="translate(69,1)"
                          />
                          <path
                            d="M0 0 C0 1.65 0 3.3 0 5 C-3.30994713 6.65497356 -6.99123 6.10084335 -10.625 6.0625 C-11.42679688 6.05798828 -12.22859375 6.05347656 -13.0546875 6.04882812 C-15.03649006 6.03703168 -17.01825433 6.01909605 -19 6 C-19.33 5.01 -19.66 4.02 -20 3 C-13.12418702 0.8408662 -7.21471629 -0.35482211 0 0 Z "
                            transform="translate(192,83)"
                          />
                          <path
                            d="M0 0 C3.40680413 0.30970947 5.56041967 0.68766661 8.375 2.6875 C10.47924548 5.68200318 10.54553343 7.41506602 10 11 C7 13 7 13 5 13.0625 C1.66152429 11.28893478 1.15354065 8.46062196 0 5 C-0.1875 2.0625 -0.1875 2.0625 0 0 Z "
                            transform="translate(157,171)"
                          />
                          <path
                            d="M0 0 C2.3125 -0.25 2.3125 -0.25 5 0 C7.36333906 2.20035016 7.95031691 3.46590679 8.25 6.6875 C8 9 8 9 7 10 C4.0625 10.25 4.0625 10.25 1 10 C-1.56687367 6.1496895 -0.83288724 4.41430237 0 0 Z "
                            transform="translate(13,61)"
                          />
                          <path
                            d="M0 0 C-0.345844 3.11259604 -0.87379967 4.82872813 -2.75 7.375 C-5 9 -5 9 -7.75 8.75 C-8.4925 8.5025 -9.235 8.255 -10 8 C-10 6.35 -10 4.7 -10 3 C-8.68 2.67 -7.36 2.34 -6 2 C-6 1.34 -6 0.68 -6 0 C-3.50907189 -1.24546405 -2.58919267 -0.7767578 0 0 Z "
                            transform="translate(35,137)"
                          />
                          <path
                            d="M0 0 C2.31 0 4.62 0 7 0 C7.1875 2.375 7.1875 2.375 7 5 C4 7 4 7 1.3125 6.625 C0.549375 6.41875 -0.21375 6.2125 -1 6 C-0.67 4.02 -0.34 2.04 0 0 Z "
                            fill="#D5D5D5"
                            transform="translate(116,12)"
                          />
                          <path
                            d="M0 0 C2.875 -0.125 2.875 -0.125 6 0 C6.66 0.66 7.32 1.32 8 2 C7.625 4.125 7.625 4.125 7 6 C4.625 6.1875 4.625 6.1875 2 6 C0 3 0 3 0 0 Z "
                            transform="translate(175,139)"
                          />
                          <path
                            d="M0 0 C1.4540625 0.0309375 1.4540625 0.0309375 2.9375 0.0625 C2.0625 4.9375 2.0625 4.9375 0.9375 6.0625 C-0.72867115 6.10313832 -2.39638095 6.105221 -4.0625 6.0625 C-4.105221 4.39638095 -4.10313832 2.72867115 -4.0625 1.0625 C-3.0625 0.0625 -3.0625 0.0625 0 0 Z "
                            transform="translate(165.0625,30.9375)"
                          />
                          <path
                            d="M0 0 C-0.66 2.31 -1.32 4.62 -2 7 C-2.66 6.34 -3.32 5.68 -4 5 C-5.65 6.65 -7.3 8.3 -9 10 C-9.99 9.67 -10.98 9.34 -12 9 C-10.71142987 7.68445979 -9.41904109 6.37265903 -8.125 5.0625 C-7.04605469 3.96615234 -7.04605469 3.96615234 -5.9453125 2.84765625 C-3.85726291 0.86442843 -2.89054652 0 0 0 Z "
                            transform="translate(161,39)"
                          />
                          <path
                            d="M0 0 C1.32 0 2.64 0 4 0 C4.125 2.375 4.125 2.375 4 5 C3.34 5.66 2.68 6.32 2 7 C0.68 7 -0.64 7 -2 7 C-1.125 1.125 -1.125 1.125 0 0 Z "
                            transform="translate(98,171)"
                          />
                          <path
                            d="M0 0 C1.65 0 3.3 0 5 0 C5.33 1.32 5.66 2.64 6 4 C4.02 4.99 4.02 4.99 2 6 C1.34 5.34 0.68 4.68 0 4 C0 2.68 0 1.36 0 0 Z "
                            transform="translate(0,158)"
                          />
                          <path
                            d="M0 0 C0 3 0 3 -1.6796875 5.04296875 C-2.76636719 6.10451172 -2.76636719 6.10451172 -3.875 7.1875 C-4.95394531 8.26064453 -4.95394531 8.26064453 -6.0546875 9.35546875 C-8 11 -8 11 -10 11 C-8.55218207 7.55571735 -6.72305391 5.63869038 -3.875 3.25 C-3.15054687 2.63640625 -2.42609375 2.0228125 -1.6796875 1.390625 C-0.84824219 0.70226562 -0.84824219 0.70226562 0 0 Z "
                            transform="translate(28,153)"
                          />
                          <path
                            d="M0 0 C2.475 0.495 2.475 0.495 5 1 C5 2.32 5 3.64 5 5 C3.35 5 1.7 5 0 5 C0 3.35 0 1.7 0 0 Z "
                            transform="translate(167,58)"
                          />
                          <path
                            d="M0 0 C0.99 1.32 1.98 2.64 3 4 C3.66 4 4.32 4 5 4 C4.34 6.31 3.68 8.62 3 11 C2.34 10.01 1.68 9.02 1 8 C0.34 8.66 -0.32 9.32 -1 10 C-0.67 6.7 -0.34 3.4 0 0 Z "
                            transform="translate(108,57)"
                          />
                          <path
                            d="M0 0 C1.32 0 2.64 0 4 0 C3.67 1.65 3.34 3.3 3 5 C1.68 4.67 0.36 4.34 -1 4 C-0.67 2.68 -0.34 1.36 0 0 Z "
                            transform="translate(175,59)"
                          />
                          <path
                            d="M0 0 C0 1.65 0 3.3 0 5 C-1.32 5.33 -2.64 5.66 -4 6 C-4 4.35 -4 2.7 -4 1 C-2 0 -2 0 0 0 Z "
                            transform="translate(28,57)"
                          />
                        </svg>
                      </Link>
                    )}
                    <Link
                      href={`/user/${userData?.profileurl}/gallery`}
                      className="hidden text-sm font-semibold leading-6 text-white sm:block bg-indigo-600 p-2 pt-1 pb-1 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Gallery
                    </Link>
                    <button
                      type="button"
                      className="hidden text-sm font-semibold leading-6 text-white sm:block bg-indigo-600 p-2 pt-1 pb-1 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                    >
                      Copy URL
                    </button>

                    <Menu as="div" className="relative sm:hidden">
                      <Menu.Button className="-m-3 block p-3">
                        <span className="sr-only">More</span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5 text-white/80"
                          aria-hidden="true"
                        />
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-white/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <>
                                <Link
                                  href={`/user/${username}/gallery`}
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "block w-full px-3 py-1 text-left text-sm leading-6 text-black"
                                  )}
                                >
                                  Gallery
                                </Link>
                                <button
                                  type="button"
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "block w-full px-3 py-1 text-left text-sm leading-6 text-black"
                                  )}
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      window.location.href
                                    )
                                  }
                                >
                                  Copy URL
                                </button>
                              </>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {/* Summary */}
                <div className="lg:col-start-3 lg:row-end-1">
                  <h2 className="sr-only">Summary</h2>
                  <div className="rounded-lg border shadow-sm ring-1 dark:ring-white/20 ring-black/20">
                    <dl className="flex flex-wrap">
                      <div className="mt-6 flex w-full flex-none gap-x-4 px-6">
                        <dt className="flex-none">
                          <span className="sr-only">User</span>
                          <UserCircleIcon
                            className="h-6 w-5 dark:text-gray-400 text-gray-900"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm font-medium leading-6">
                          {userData?.displayname}
                        </dd>
                      </div>
                      <div
                        className={`mt-4 mb-4 flex w-full flex-none gap-x-4 px-6`}
                      >
                        <dt className="flex-none">
                          <span className="sr-only">Status</span>
                          <PencilSquareIcon
                            className="h-6 w-5 dark:text-gray-400 text-gray-900"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm font-medium leading-6">
                          {userData?.status}
                        </dd>
                      </div>
                      {userData?.pronouns !== "" && (
                        <div
                          className={`flex w-full flex-none gap-x-4 px-6 ${
                            formattedBirthday === "31.01.1900" ? " mb-4" : ""
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Pronouns</span>
                            <FontAwesomeIcon
                              className="h-6 w-5 dark:text-gray-400 text-gray-900"
                              icon={faPersonHalfDress}
                            />
                          </dt>
                          <dd className="text-sm font-medium leading-6">
                            {userData?.pronouns}
                          </dd>
                        </div>
                      )}
                      {formattedBirthday !== "31.01.1900" && (
                        <div
                          className={`mt-4 flex w-full flex-none gap-x-4 px-6 mb-4 ${
                            userData?.location === "" ? "mb-6" : ""
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Birthday</span>
                            <CalendarDaysIcon
                              className="h-6 w-5 dark:text-gray-400 text-gray-900"
                              aria-hidden="true"
                            />
                          </dt>
                          <dd className="text-sm leading-6">
                            <time dateTime={rawBirthday}>
                              {formattedBirthday}
                            </time>
                          </dd>
                        </div>
                      )}
                      {userData?.location !== null &&
                        userData?.location !== "" && (
                          <div
                            className={`flex w-full flex-none gap-x-4 px-6 mb-4`}
                          >
                            <dt className="flex-none">
                              <span className="sr-only">Location</span>
                              <FontAwesomeIcon
                                className="h-6 w-5 dark:text-gray-400 text-gray-900"
                                icon={faFlag}
                              />
                            </dt>
                            <dd className="text-sm font-medium leading-6">
                              {userData?.location}
                            </dd>
                          </div>
                        )}
                    </dl>
                  </div>
                </div>

                {/* Biography */}
                <div className="-mx-4 px-4 py-8 shadow-sm ring-1 dark:ring-white/95 ring-black/95 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                  <h2 className="text-2xl font-semibold leading-6 border-b dark:border-white border-black pb-2">
                    Biografie
                  </h2>
                  <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                    <div className="flex">
                      <div
                        className="font-medium dark:text-gray-300 text-gray-800"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {userData?.bio}
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="lg:col-start-3">
                  {/* Activity feed */}
                  <h2 className="text-sm font-semibold leading-6">Activity</h2>
                  <ul role="list" className="mt-6 space-y-6">
                    {activity.map((activityItem, activityItemIdx) => (
                      <li
                        key={activityItem.id}
                        className="relative flex gap-x-4"
                      >
                        <div
                          className={classNames(
                            activityItemIdx === activity.length - 1
                              ? "h-6"
                              : "-bottom-6",
                            "absolute left-0 top-0 flex w-6 justify-center"
                          )}
                        >
                          <div className="w-px dark:bg-gray-200 bg-gray-700" />
                        </div>
                        {activityItem.type === "commented" && (
                          <>
                            <Image
                              src={activityItem.person.imageUrl}
                              alt=""
                              className="relative mt-3 h-6 w-6 flex-none rounded-full dark:bg-gray-50 bg-gray-950"
                              width={24}
                              height={24}
                            />
                            <div className="flex-auto rounded-md p-3 ring-1 ring-inset dark:ring-gray-200 ring-gray-700">
                              <div className="flex justify-between gap-x-4">
                                <div className="py-0.5 text-xs leading-5">
                                  <span className="font-medium">
                                    {activityItem.person.name}
                                  </span>{" "}
                                  <span className="dark:text-gray-300 text-gray-800">
                                    commented
                                  </span>
                                </div>
                                <time
                                  dateTime={activityItem.dateTime}
                                  className="flex-none py-0.5 text-xs leading-5 dark:text-gray-500 text-gray-900"
                                >
                                  {activityItem.date}
                                </time>
                              </div>
                              <p className="text-sm leading-6 dark:text-gray-500 text-gray-900">
                                {activityItem.comment}
                              </p>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* New comment form */}
                  <div className="mt-6 flex gap-x-3">
                    <Image
                      src="/logos/logo.webp"
                      alt=""
                      className="h-6 w-6 flex-none rounded-full"
                      width={24}
                      height={24}
                    />
                    <form action="#" className="relative flex-auto">
                      <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset dark:ring-gray-300 ring-gray-800 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label htmlFor="comment" className="sr-only">
                          Add your comment
                        </label>
                        <textarea
                          rows={2}
                          name="comment"
                          id="comment"
                          className="block w-full resize-none border-0 bg-transparent py-1.5 dark:placeholder:text-gray-400 placeholder:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Add your comment..."
                          defaultValue={""}
                        />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                          <div className="flex items-center">
                            <Listbox value={selected} onChange={setSelected}>
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="sr-only">
                                    Your mood
                                  </Listbox.Label>
                                  <div className="relative">
                                    <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full dark:text-gray-400 text-gray-900 hover:text-gray-500">
                                      <span className="flex items-center justify-center">
                                        {selected.value === null ? (
                                          <span>
                                            <FaceSmileIcon
                                              className="h-5 w-5 flex-shrink-0"
                                              aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                              Add your mood
                                            </span>
                                          </span>
                                        ) : (
                                          <span>
                                            <span
                                              className={classNames(
                                                selected.bgColor,
                                                "flex h-8 w-8 items-center justify-center rounded-full"
                                              )}
                                            >
                                              <selected.icon
                                                className="h-5 w-5 flex-shrink-0"
                                                aria-hidden="true"
                                              />
                                            </span>
                                            <span className="sr-only">
                                              {selected.name}
                                            </span>
                                          </span>
                                        )}
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg py-3 text-base shadow focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                        {moods.map((mood) => (
                                          <Listbox.Option
                                            key={mood.value}
                                            className={({ active }) =>
                                              classNames(
                                                active
                                                  ? "bg-indigo-600"
                                                  : "dark:bg-white bg-black",
                                                "relative cursor-default select-none px-3 py-2"
                                              )
                                            }
                                            value={mood}
                                          >
                                            <div className="flex items-center">
                                              <div
                                                className={classNames(
                                                  mood.bgColor,
                                                  "flex h-8 w-8 items-center justify-center rounded-full"
                                                )}
                                              >
                                                <mood.icon
                                                  className={classNames(
                                                    mood.iconColor,
                                                    "h-5 w-5 flex-shrink-0"
                                                  )}
                                                  aria-hidden="true"
                                                />
                                              </div>
                                              <span className="ml-3 block truncate font-medium dark:text-black text-white">
                                                {mood.name}
                                              </span>
                                            </div>
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                          disabled
                        >
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : hasError ? (
          <ErrorPage />
        ) : (
          <Loading />
        )}
      </main>
    </>
  );
}
