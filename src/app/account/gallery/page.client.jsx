"use client";
import { useState, useEffect } from "react";
import ErrorPage from "@/app/not-found";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/loading";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getGalleryImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  fetch("/api/user/getUserSelf", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      setUserId(data[0].$id);
      return fetch(`/api/user/getUserDataSelf`, {
        method: "GET",
      });
    })
    .then((response) => response.json())
    .then((userData) => {
      setEnableNsfw(userData[0].enablensfw);
    })
    .catch((err) => {
      setError(err.message || "Kann daten nicht laden. Bitte neu laden.");
      setTimeout(() => {
        setError(null);
      }, 10000);
    })
    .finally(() => {
      setIsLoading(false);
    });

  useEffect(() => {
    if (!userId) return; // Wait for userId to be available

    const filters = !enableNsfw
      ? `queries[]=equal("userId","${userId}")&queries[]=equal("nsfw",false)`
      : `queries[]=equal("userId","${userId}")`;

    const pageSize = 2; // Number of items per page
    const offset = (currentPage - 1) * pageSize; // Calculate offset based on current page
    const apiUrl = `/api/gallery/getUserGallery?${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`;

    setIsLoading(true);

    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        //setGallery(data.data.reverse());
        setGallery(data.documents);
        setTotalPages(data.meta.pagination.pageCount);
      })
      .catch((err) => {
        setError(err.message || "Ein Fehler ist aufgetreten.");
        setTimeout(() => {
          setError(null);
        }, 7000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId, enableNsfw, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`);
  };

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <div>
        {isLoading ? (
          error ? (
            <p className="text-center text-red-500 font-bold my-8">Error!</p>
          ) : (
            <Loading />
          )
        ) : (
          <>
            <ul
              role="list"
              className="p-8 flex flex-wrap gap-4 justify-center items-center"
            >
              {gallery.map((item) => (
                <div key={item.$id}>
                  {item && (
                    <div
                      className={`rounded-lg overflow-hidden h-64 ${
                        item.nsfw && !enableNsfw ? "relative" : ""
                      }`}
                    >
                      {item.nsfw && !enableNsfw && (
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                      )}
                      <Link href={`/account/gallery/${item.$id}`}>
                        <Image
                          src={getGalleryImageUrl(item.gallery_id)}
                          alt={item.imgalt}
                          className={`object-cover h-full w-full max-h-[600px] max-w-[600px]`}
                          width={600}
                          height={600}
                          loading="lazy" // Add this attribute for lazy loading
                        />
                      </Link>
                    </div>
                  )}
                  <h2>{item.name}</h2>
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
      {/* Pagination buttons */}
      <div className="flex justify-center items-center my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`mx-2 px-4 py-2 rounded-lg ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
