"use client";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import { useState, useEffect } from "react";

export default function FetchGallery({ data }) {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getGalleryImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&quality=100&height=500&operation=fit`;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });
        const data = await response.json();
        setUserId(data.documents[0].$id);

        const userDataResponse = await fetch(
          `/api/user/getUserDataSelf/${data.documents[0].$id}`,
          {
            method: "GET",
          }
        );
        const userData = await userDataResponse.json();
        setEnableNsfw(userData[0].enablensfw);
      } catch (err) {
        setError(err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      setIsLoading(true);
      const filters = !enableNsfw ? `&queries[]=equal("nsfw",false)` : ``;
      const pageSize = 500; // Number of items per page
      const offset = (currentPage - 1) * pageSize; // Calculate offset based on current page
      const apiUrl = `/api/gallery/getTotalGallery?${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`;

      setIsLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
        });

        const data = await response.json();
        // Shuffle once when fetched
        const shuffledData = data.documents
          .sort(() => Math.random() - 0.5)
          .reverse();
        setGallery(shuffledData);
        setTotalPages(data.total);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, [currentPage, enableNsfw]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  return (
    <div>
      {/* Pagination buttons */}
      {/*<div className="flex justify-center items-center my-4">
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
      </div>*/}
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <ul className="p-8 flex flex-wrap gap-4 justify-center items-center">
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
                    <Link href={`/gallery/${item.$id}`}>
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
        )}
      </div>
    </div>
  );
}
