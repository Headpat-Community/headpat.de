"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/loading";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";

export default function AccountPage() {
  const [userData, setUserData] = useState({ enablensfw: false }); // Initialize with an empty object and a default value
  const [userMe, setUserMe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Start loading
      try {
        const userResponse = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });
        const userResponseData = await userResponse.json();
        setUserMe(userResponseData[0]);

        const userDataResponse = await fetch(`/api/user/getUserDataSelf`, {
          method: "GET",
        });
        const userDataResponseData = await userDataResponse.json();
        setUserData(userDataResponseData.documents[0]);
        setIsLoading(false); // Done loading
      } catch (error) {
        console.error(error);
        window.location.reload();
        setIsLoading(false); // Done loading, even if there's an error
      }
    };
    fetchUserData();
  }, []);

  const handleEmailChange = async (event) => {
    event.preventDefault();

    try {
      const email = document.getElementById("email").value;
      const email_password = document.getElementById("email_password").value;

      // Check if profileUrl has at least 4 characters
      if (email_password.length < 8) {
        setError("Please enter a valid password.");
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch(`/api/user/editUserEmail`, {
        method: "PATCH",
        body: JSON.stringify({
          email: email,
          password: email_password,
        }),
      });

      const responseData = await response.json();
      if (response.status === 401) {
        setError("Passwort ist inkorrekt.");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      if (response.status === 409) {
        setError("Es existiert bereits ein Account mit dieser E-Mail-Adresse.");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
      if (response.ok) {
        setIsUploading(false); // Set isUploading to false after the API call is complete
        setSuccess("E-Mail-Adresse erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
        event.target.reset();
      } else {
        // Check for the specific error structure
        if (
          responseData.error &&
          responseData.error.message === "bio must be at most 256 characters"
        ) {
          // Show an error message to the user
          setError("Error");
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();

    const currentPassword = event.target.currentpassword.value;
    const newPassword = event.target.newpassword.value;

    // Check if profileUrl has at least 4 characters
    if (newPassword.length < 8) {
      setError("Please enter a valid password.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    try {
      const response = await fetch("/api/user/editUserPassword", {
        method: "PATCH",
        body: JSON.stringify({
          password: newPassword,
          oldPassword: currentPassword,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        setError(data.error.message);
        setTimeout(() => {
          setError(null);
        }, 5000);
      } else if (response.ok) {
        setSuccess("Passwort erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
        event.target.reset();
      } else {
        setError("Password reset failed");
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const secondaryNavigation = [
    { name: "Account", href: "/account", current: true },
    { name: "Frontpage", href: "/account/frontpage", current: false },
    { name: "Socials", href: "/account/socials", current: false },
  ];

  const handleNsfwChange = async (event) => {
    const { checked } = event.target;

    setUserData((prevUserData) => ({
      ...prevUserData,
      enablensfw: checked,
    }));

    const isChecked = checked; // Save the value before async operations

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });
      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;

      const putResponse = await fetch(`/api/user/handleNsfwChange/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            enablensfw: isChecked,
          },
        }),
      });

      if (!putResponse.ok) {
        throw new Error("PUT request failed");
      }

      // Update userMe state after successful request
      setSuccess("NSFW erfolgreich geändert.");
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

      setUserMe((prevUserMe) => ({
        ...prevUserMe,
        enablensfw: isChecked,
      }));
    } catch (error) {
      console.error(error.message);
      if (error.response) {
        const response = await error.response.json();
      }
    }
  };

  const handleProfileUrlChange = async (event) => {
    event.preventDefault();

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;
      const profileUrl = document.getElementById("profileurl").value;

      // Check if profileUrl has at least 4 characters
      if (profileUrl.length < 3) {
        setError("Profile URL must be at least 3 characters long.");
        setTimeout(() => {
          setError(null);
        }, 5000);
        return;
      }

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch(`/api/user/editUserData/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            profileurl: profileUrl,
          },
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setSuccess("Profile URL erfolgreich geändert.");
        setTimeout(() => {
          setSuccess(null);
        }, 5000);

        setIsUploading(false); // Set isUploading to false after the API call is complete
        setUserData(responseData); // Set the userData state with the response data
        //window.location.reload();
      } else {
        // Check for the specific error structure
        if (
          responseData.error &&
          responseData.error.message === "bio must be at most 256 characters"
        ) {
          // Show an error message to the user
          setError("Biografie darf nur bis 256 zeichen lang sein.");
          setTimeout(() => {
            setError(null);
          }, 5000);
        } else {
          console.error("Failed to upload file:", responseData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <header className="border-b dark:border-white/5 border-black/5">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 dark:text-gray-400 text-gray-900 sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={item.current ? "text-indigo-400" : ""}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="divide-y dark:divide-white/5 divide-black/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7">
                Change Email
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Ändere deine E-Mail-Adresse.
              </p>
            </div>

            <form onSubmit={handleEmailChange} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={userMe ? userMe.email : ""}
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6"
                  >
                    Current Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <input
                        type="password"
                        name="email_password"
                        id="email_password"
                        required
                        autoComplete="current-password"
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7">Profile URL</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Dein Profil-URL ist der Link, den du mit anderen teilen kannst,
                um dein Profil zu zeigen.
              </p>
            </div>

            <form onSubmit={handleProfileUrlChange} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6"
                  >
                    URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white/5 ring-1 ring-inset dark:ring-white/10 ring-black/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <span className="flex select-none items-center pl-3 text-gray-400 sm:text-sm">
                        https://headpat.de/user/
                      </span>
                      <input
                        type="text"
                        name="profileurl"
                        id="profileurl"
                        required
                        placeholder={userData ? userData.profileurl : ""}
                        className="flex-1 border-0 bg-transparent py-1.5 pl-1 focus:ring-0 sm:text-sm sm:leading-6"
                        minLength="4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-">
                Change password
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Ändere dein Passwort.
              </p>
            </div>

            <form className="md:col-span-2" onSubmit={handlePasswordReset}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <span
                    htmlFor="current-password"
                    className="block text-sm font-medium mb-2"
                  >
                    Current password
                  </span>
                  <input
                    type="password"
                    name="currentpassword" // Updated name
                    id="currentpassword"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="col-span-full">
                  <span
                    htmlFor="new-password"
                    className="block text-sm font-medium mb-2"
                  >
                    New password
                  </span>
                  <input
                    type="password"
                    name="newpassword" // Updated name
                    id="newpassword"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="col-span-full">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
            <div>
              <h2 className="text-base font-semibold leading-7">Enable NSFW</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Checking this box will enable NSFW images. 18+ only.
              </p>
              <p className="text-sm leading-6 text-gray-400">
                Anyone under the age of 18 caught viewing NSFW content will be
                suspended.
              </p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full">
                  <input
                    id="nsfwtoggle"
                    aria-describedby="nsfwtoggle"
                    name="nsfwtoggle"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    checked={userMe?.enablensfw}
                    onChange={handleNsfwChange}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
