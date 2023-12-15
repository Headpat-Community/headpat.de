"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/loading";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";

export default function AccountPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [userData, setUserData] = useState({
    status: "",
    bio: "",
    displayname: "",
    pronouns: "",
    birthday: "",
    location: "",
    avatar: "",
  });

  const getAvatarImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userDataResponse = await fetch(`/api/user/getUserDataSelf`, {
          method: "GET",
        });

        const userDataResponseData = await userDataResponse.json();
        //console.log(userDataResponseData.data.attributes);
        setUserData({
          status: userDataResponseData.documents[0].status || "",
          bio: userDataResponseData.documents[0].bio || "",
          displayname: userDataResponseData.documents[0].displayname || "",
          birthday: userDataResponseData.documents[0].birthday || "",
          pronouns: userDataResponseData.documents[0].pronouns || "",
          location: userDataResponseData.documents[0].location || "",
          avatar:
            getAvatarImageUrl(userDataResponseData.documents[0].avatarId) ||
            "/logos/logo.webp", // Set the avatar value or a placeholder image
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("Dateigröße darf nur bis 2MB groß sein.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = (event) => {
      const imgElement = document.getElementById("avatar-image");
      imgElement.src = event.target.result;
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        if (img.width <= 1024 && img.height <= 1024) {
          setSelectedFile(selectedFile);
        } else {
          setError("Bild darf nur bis 1024x1024 pixel groß sein.");
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      };
    };
  };

  const handleSubmitAVatar = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileId", "unique()");

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;

      // Year-Month-Day (YYYY-MM-DD)

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch(`/api/user/avatarChange/${userId}`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        //console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        // Reload the window
        //setSuccess("Gespeichert und hochgeladen!");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //const formData = new FormData();
    //formData.append("file", selectedFile);

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;

      // Year-Month-Day (YYYY-MM-DD)

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch(`/api/user/editUserData/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          data: {
            status: document.getElementById("status").value,
            bio: document.getElementById("biostatus").value,
            displayname: document.getElementById("displayname").value,
            birthday: new Date(document.getElementById("birthday").value)
              .toISOString()
              .split("T")[0],
            pronouns: document.getElementById("pronouns").value,
            location: document.getElementById("location").value,
          },
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        //console.log("File uploaded successfully");
        setIsUploading(false); // Set isUploading to false after the API call is complete
        setUserData(responseData); // Set the userData state with the response data
        //setSuccess("Gespeichert!");
        // Reload the window
        window.location.reload();
      } else {
        // Check for the specific error structure
        if (
          responseData.error &&
          responseData.error.message === "bio must be at most 2048 characters"
        ) {
          // Show an error message to the user
          setError("Biografie darf nur bis 2048 zeichen lang sein.");
        } else {
          console.error("Failed to upload file:", responseData);
          setError("Ein Fehler ist aufgetreten.");
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Ein Fehler ist aufgetreten.");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const secondaryNavigation = [
    { name: "Account", href: "/account", current: false },
    { name: "Frontpage", href: "/account/frontpage", current: true },
    { name: "Socials", href: "/account/socials", current: false },
  ];

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
                Frontpage Einstellungen
              </h2>
              <p className="mt-1 text-sm leading-6 dark:text-gray-400 text-gray-900">
                Hier kannst du deine Biografie, Profilbild etc. verwalten.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                <div className="col-span-full flex items-center gap-x-8">
                  <img
                    id="avatar-image"
                    src={userData.avatar || "/logos/logo.webp"}
                    alt=""
                    className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                  />
                  <div>
                    <input
                      accept="image/*"
                      className="rounded-md px-3 py-2 text-sm font-semibold shadow-sm hover:bg-white/20 ring-1 dark:ring-white/10 ring-black/10"
                      id="avatar-upload"
                      name="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <div className="flex justify-between items-center">
                      <p className="mt-2 text-xs leading-5 dark:text-gray-400 text-gray-900">
                        JPG, GIF or PNG. 2MB max.
                      </p>
                      <button
                        type="submit"
                        onClick={handleSubmitAVatar}
                        className="mt-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Submit
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-5 dark:text-gray-400 text-gray-900">
                      1024x1024 max. resolution
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-full sm:grid-cols-6 mt-12">
                <div className="col-span-full">
                  <label
                    htmlFor="displayname"
                    className="block text-sm font-medium leading-6"
                  >
                    Display Name
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="displayname"
                      name="displayname"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.displayname || ""} // Set the value from state, or an empty string if it's undefined
                      onChange={(e) => {
                        if (e.target.value.length <= 32) {
                          setUserData({
                            ...userData,
                            displayname: e.target.value,
                          });
                        }
                      }} // Update state when the input changes, only if the length is less than or equal to 32
                      maxLength={32} // Limit the maximum number of characters to 32
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <span className="select-none">
                        {userData.displayname ? userData.displayname.length : 0}{" "}
                        {/* Check if userData.displayname is defined before accessing its length property */}
                      </span>
                      <span className="text-gray-400 select-none">/{32}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium leading-6"
                  >
                    Status
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="status"
                      name="status"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.status} // Set the value from state
                      onChange={(e) => {
                        if (e.target.value.length <= 24) {
                          setUserData({ ...userData, status: e.target.value });
                        }
                      }} // Update state when the input changes, only if the length is less than or equal to 24
                      maxLength={24} // Limit the maximum number of characters to 24
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <span className="select-none">
                        {userData.status ? userData.status.length : 0}{" "}
                      </span>
                      <span className="text-gray-400 select-none">/{24}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="pronouns"
                    className="block text-sm font-medium leading-6"
                  >
                    Pronouns
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="pronouns"
                      name="pronouns"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.pronouns} // Set the value from state
                      onChange={(e) => {
                        if (e.target.value.length <= 16) {
                          setUserData({
                            ...userData,
                            pronouns: e.target.value,
                          });
                        }
                      }} // Update state when the input changes, only if the length is less than or equal to 16
                      maxLength={16} // Limit the maximum number of characters to 16
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <span className="select-none">
                        {userData.pronouns ? userData.pronouns.length : 0}{" "}
                      </span>
                      <span className="text-gray-400 select-none">/{16}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="birthday"
                    className="block text-sm font-medium leading-6"
                  >
                    Birthday
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="birthday"
                      name="birthday"
                      type="date"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={
                        userData.birthday
                          ? new Date(userData.birthday)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      } // Set the value from state in the correct format
                      onChange={(e) => {
                        setUserData({ ...userData, birthday: e.target.value });
                      }} // Update state when the input changes
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <span
                        aria-disabled
                        className="text-gray-400 select-none mr-6"
                      >
                        DD/MM/YYYY
                      </span>{" "}
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium leading-6"
                  >
                    Location
                  </label>
                  <div className="mt-2 relative">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      value={userData.location} // Set the value from state
                      onChange={(e) => {
                        if (e.target.value.length <= 256) {
                          setUserData({
                            ...userData,
                            location: e.target.value,
                          });
                        }
                      }} // Update state when the input changes, only if the length is less than or equal to 16
                      maxLength={256} // Limit the maximum number of characters to 16
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <span className="select-none">
                        {userData.location ? userData.location.length : 0}{" "}
                      </span>
                      <span className="text-gray-400 select-none">/{256}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="biostatus"
                    className="block text-sm font-medium leading-6"
                  >
                    Bio
                  </label>
                  <div className="mt-2 relative">
                    <textarea
                      id="biostatus"
                      name="biostatus"
                      className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 h-72"
                      value={userData.bio} // Set the value from state
                      onChange={(e) => {
                        if (e.target.value.length <= 2048) {
                          setUserData({ ...userData, bio: e.target.value });
                        }
                      }} // Update state when the input changes, only if the length is less than or equal to 256
                      maxLength={2048} // Limit the maximum number of characters to 256
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 pb-2 flex items-end text-sm leading-5 pointer-events-none">
                      <span className="select-none">
                        {userData.bio ? userData.bio.length : 0}{" "}
                      </span>
                      <span className="text-gray-400 select-none">/{2048}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 hover:bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
