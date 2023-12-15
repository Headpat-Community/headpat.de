"use client";
import { useState, useCallback } from "react";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/tiff",
      "image/x-icon",
      "image/vnd.djvu",
    ];
    if (!validImageTypes.includes(selectedFile.type)) {
      setError(
        "Please select a valid image file type (JPEG, PNG, GIF, SVG, TIFF, ICO, DVU)."
      );
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }
    if (selectedFile.size > 16 * 1024 * 1024) {
      setError("File size must be less than 16 MB.");
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

    if (!selectedFile) {
      setError("Bitte wähle ein Bild aus.");
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    formData.append("fileId", "unique()");
    formData.append("file", selectedFile);

    try {
      const userResponse = await fetch("/api/user/getUserSelf", {
        method: "GET",
      });

      const userResponseData = await userResponse.json();
      const userId = userResponseData[0].$id;

      setIsUploading(true); // Set isUploading to true before making the API call

      const response = await fetch("/api/gallery/uploadImage", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.status === 201) {
        const editImage = await fetch(
          `/api/gallery/editUserGallery/${responseData.$id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              data: {
                name: imagename.value,
                imgalt: imgalt.value,
                longtext: longtext.value,
                nsfw: nsfw.checked,
                userId: userId,
              },
            }),
          }
        );

        const editImageData = await editImage.json();
        if (editImage.status === 200) {
          setSuccess("Gespeichert und hochgeladen! Einen moment bitte...");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          console.error("Failed to edit image:", editImageData);
        }
      } else {
        setError("Fehler beim hochladen. Bitte versuche es erneut.");
        setTimeout(() => {
          setError(null);
        }, 5000);
        console.error("Failed to upload file:", responseData);
        setIsUploading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7">Image Upload</h2>
            <p className="mt-1 text-sm leading-6 dark:text-gray-400 text-gray-900">
              Diese Informationen werden öffentlich angezeigt. Sei also
              vorsichtig, was du teilst.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed dark:border-white/25 border-black/25 px-6 py-10">
                  <div className="text-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      onDrop={handleDrop}
                      onDragOver={(event) => event.preventDefault()}
                    >
                      <img
                        id="selected-image"
                        className="mx-auto h-96 min-w-full object-cover rounded-md"
                        alt="Placeholder Image"
                        src="/images/placeholder-image-color.webp"
                        onDrop={handleDrop}
                        onDragOver={(event) => event.preventDefault()}
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
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
                        <p className="pl-1">
                          PNG, JPEG, GIF, SVG, TIFF, ICO, DVU up to 16MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7">Informationen</h2>
            <p className="mt-1 text-sm leading-6 dark:text-gray-400 text-gray-900">
              Alles mit ein asterisk (<span className="text-red-500">*</span>)
              ist nötig.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="imagename"
                    id="imagename"
                    required
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6">
                  Alternative Informationen (SEO)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="imgalt"
                    id="imgalt"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium leading-6">
                  NSFW
                </label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="nsfw"
                    id="nsfw"
                    className="h-4 w-4 rounded dark:border-gray-300 border-gray-800 text-indigo-600 focus:ring-transparent"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="biostatus"
                  className="block text-sm font-medium leading-6"
                >
                  Description
                </label>
                <div className="mt-2 relative">
                  <textarea
                    id="longtext"
                    name="longtext"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset dark:ring-white/10 ring-black/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 h-72"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6">
            Cancel
          </button>
          <button
            type="submit"
            value="Submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            disabled={isUploading} // Disable the button if isUploading is true
          >
            {isUploading ? "Uploading..." : "Save"}{" "}
            {/* Show different text based on the upload state */}
          </button>
        </div>
      </form>
    </>
  );
}
