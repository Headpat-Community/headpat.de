"use client";
import { useCallback, useState, useRef } from "react";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";

export default function BadgePageComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deliverAtEurofurence, setDeliverAtEurofurence] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const displaynameRef = useRef("");
  const nicknameRef = useRef("");
  const pronounsRef = useRef("");
  const speciesRef = useRef("");
  const addressRef = useRef("");
  const cityRef = useRef("");
  const countryRef = useRef("");
  const stateRef = useRef("");
  const postalcodeRef = useRef("");

  const handleCheckboxChange = useCallback((event) => {
    setDeliverAtEurofurence(event.target.checked);
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/tiff",
      "image/x-icon",
      "image/vnd.djvu",
    ];
    if (!validImageTypes.includes(selectedFile.type)) {
      setError(
        "Please select a valid image file type (JPEG, PNG, SVG, TIFF, ICO, DVU)."
      );
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }
    if (selectedFile.size > 1 * 1024 * 1024) {
      setError("File size must be less than 1 MB.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    fileReader.onload = (event) => {
      const imgElement = document.getElementById("selected-image");
      imgElement.src = event.target.result;
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        if (img.width >= 128 && img.height >= 128) {
          setSelectedFile(selectedFile);
        } else {
          setError("Image resolution must be at least 128x128 pixels.");
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      };
    };
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileId", "unique()");

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData.id;

      const badgeResponse = await fetch(
        `/api/account/getBadges?queries[]=equal("$id","${userId}")`,
        {
          method: "GET",
        }
      );

      const badgeData = await badgeResponse.json();

      if (badgeData.files && badgeData.files.length > 0) {
        const userDecision = window.confirm(
          "You've already submitted before. Do you want to continue?"
        );
        if (!userDecision) return; // If user clicks "No", then return and don't proceed
      }

      formData.append(
        "data",
        JSON.stringify({
          data: {
            user_id: userId,
            displayname: displaynameRef.current?.value,
            nickname: nicknameRef.current?.value,
            pronouns: pronounsRef.current?.value,
            species: speciesRef.current?.value,
            address: addressRef.current?.value,
            city: cityRef.current?.value,
            country: countryRef.current?.value,
            state: stateRef.current?.value,
            postalcode: postalcodeRef.current?.value,
            deliver_at_eurofurence: deliver_at_eurofurence.checked,
          },
        })
      );

      setIsUploading(true);

      const response = await fetch("/api/account/createBadge", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      setIsUploading(false);

      if (response.ok) {
        setSuccess("Danke für deine Anfrage!");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setError(
          "Anfrage fehlgeschlagen, bitte versuche es erneut oder kontaktiere uns. Fehler: " +
            responseData.message
        );
        setTimeout(() => {
          setError(null);
        }, 5000);
        console.error("Failed to upload file:", responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <div className="mx-auto my-8 max-w-7xl text-center">
        {/* TODO: Change image */}
        <img
          src="/images/badgefront.webp"
          alt="Badge Preview"
          className="mx-auto h-full w-full object-contain object-center max-h-[300px] rounded"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <main className="lg:min-h-full mx-auto flex justify-center">
          <div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
              <div className="lg:col-start-1">
                <h1 className="text-sm font-medium text-indigo-600">
                  Badge Request
                </h1>
                <p className="mt-2 text-3xl font-bold tracking-tight dark:text-white text-black sm:text-4xl">
                  Danke für deine Überlegung!
                </p>
                <p className="mt-2 text-base text-gray-500">
                  Danke das du dich für einen Badge interessierst! Bitte fülle
                  das Formular aus und wir werden uns so schnell wie möglich bei
                  dir melden.
                </p>
                <ul
                  role="list"
                  className="mt-6 divide-y dark:border-gray-200 border-gray-500 border-t text-sm font-medium text-gray-500"
                >
                  <li key="Badge" className="flex space-x-6 py-6">
                    <div className="text-center">
                      <h1 className="text-left text-xl">Upload image</h1>
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                        onDrop={handleDrop}
                        onDragOver={(event) => event.preventDefault()}
                      >
                        <img
                          id="selected-image"
                          className="h-32 w-32 rounded-md object-contain"
                          alt="Placeholder Image"
                          src="/images/placeholder-image-color.webp"
                          onDrop={handleDrop}
                          onDragOver={(event) => event.preventDefault()}
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-blurple font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:bg-blurple/80"
                          >
                            <span className="p-4">Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only bg-transparent"
                              onChange={handleFileChange}
                              onDrop={handleDrop}
                              onDragOver={(event) => event.preventDefault()}
                              onDragEnter={(event) => event.preventDefault()}
                            />
                          </label>
                        </div>
                      </label>
                    </div>
                    <div className="mt-1 align-middle text-center">
                      <p className="text-red-500">
                        PNG, JPEG, SVG, TIFF, ICO, DVU, WEBP
                      </p>
                      <p className="text-red-500 pt-2">Max. 512x512px, 1MB</p>
                    </div>
                  </li>
                </ul>

                <dl className="space-y-6 border-t dark:border-gray-200 border-gray-500 pt-6 text-sm font-medium dark:text-white text-black">
                  <div className="flex justify-between">
                    <dt>Name</dt>
                    <input
                      type="text"
                      name="displayname"
                      id="displayname"
                      ref={displaynameRef}
                      className="text-black rounded"
                      required
                    />
                  </div>

                  <div className="flex justify-between">
                    <dt>Spitzname/Nickname</dt>
                    <input
                      type="text"
                      name="nickname"
                      id="nickname"
                      ref={nicknameRef}
                      className="text-black rounded"
                    />
                  </div>

                  <div className="flex justify-between">
                    <dt>Pronouns</dt>
                    <input
                      type="text"
                      name="pronouns"
                      id="pronouns"
                      ref={pronounsRef}
                      className="text-black rounded"
                    />
                  </div>

                  <div className="flex justify-between">
                    <dt>Spezies/Species</dt>
                    <input
                      type="text"
                      name="species"
                      id="species"
                      ref={speciesRef}
                      className="text-black rounded"
                    />
                  </div>
                </dl>
              </div>
              <div className="lg:col-start-2">
                <h1 className="text-sm font-medium text-indigo-600">
                  Erhaltung
                </h1>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Wie möchtest du deinen Badge erhalten?
                </p>

                <div className="sm:col-span-3 mb-4 mt-6">
                  <label className="block text-xl font-medium leading-6 dark:text-white/80 text-black/80">
                    Bei Eurofurence abholen?
                  </label>
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      name="deliver_at_eurofurence"
                      id="deliver_at_eurofurence"
                      className="h-4 w-4 rounded dark:border-gray-300 border-gray-600 text-indigo-600 focus:ring-transparent"
                      checked={deliverAtEurofurence}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                </div>

                <dl className="space-y-6 border-t dark:border-gray-200 border-gray-500 pt-6 text-sm font-medium dark:text-white text-black">
                  {!deliverAtEurofurence && (
                    <>
                      <div className="flex justify-between">
                        <dt>Name</dt>
                        <input
                          type="text"
                          name="displayname"
                          id="displayname"
                          ref={displaynameRef}
                          className="text-black rounded"
                          required
                        />
                      </div>

                      <div className="flex justify-between">
                        <dt>Adresse/Address</dt>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          ref={addressRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <dt>Stadt/City</dt>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          ref={cityRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <dt>Postleitzahl/Postalcode</dt>
                        <input
                          type="text"
                          name="postalcode"
                          id="postalcode"
                          ref={postalcodeRef}
                          className="text-black rounded"
                        />
                      </div>

                      <div className="flex justify-between">
                        <label
                          htmlFor="country-select"
                          className="dark:text-white text-black rounded"
                        >
                          Land/Country
                        </label>
                        <select
                          name="country"
                          id="country"
                          ref={countryRef}
                          className="text-black appearance-none rounded"
                        >
                          <option
                            value="Germany"
                            className="bg-black text-white"
                          >
                            Deutschland
                          </option>
                          <option
                            value="Austria"
                            className="bg-black text-white"
                          >
                            Österreich
                          </option>
                          <option
                            value="Switzerland"
                            className="bg-black text-white"
                          >
                            Schweiz
                          </option>
                        </select>
                      </div>

                      <div className="flex justify-between">
                        <dt>Bundesland/State</dt>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          ref={stateRef}
                          className="text-black rounded"
                        />
                      </div>
                    </>
                  )}
                </dl>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 dark:text-white text-black"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    value="Submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    disabled={isUploading} // Disable the button if isUploading is true
                  >
                    {isUploading ? "Uploading..." : "Anfragen"}{" "}
                    {/* Show different text based on the upload state */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </>
  );
}
