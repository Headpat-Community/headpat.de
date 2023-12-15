"use client";
import React, { useState, useCallback, useEffect } from "react";
import { client } from "../appwrite";
import { createPatData } from "./page.api";

export default function PatClient() {
  const [userId, setUserId] = useState(null);
  const [patCount, setPatCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Fetch user ID
    fetch(`/api/user/getUserSelf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserId(data[0]?.$id);
      })
      .catch((error) => {
        console.error("GET request error:", error);
      });
  }, []);

  // Create a WebSocket connection
  let socket;

  function connect() {
    socket = new WebSocket(
      `wss://api.headpat.de/v1/realtime?project=6557c1a8b6c2739b3ecf&channels[]=databases.65527f2aafa5338cdb57.collections.655caf2e7a6d01e18184.documents`
    );

    // Listen for messages
    socket.addEventListener("message", (event) => {
      // Parse JSON data
      const data = JSON.parse(event.data);
      //console.log("Message from server: ", data);
    });

    // Connection closed
    socket.addEventListener("close", (event) => {
      setTimeout(connect, 1000); // try to reconnect after a second
    });

    // Connection error
    socket.addEventListener("error", (event) => {
      //console.log("WebSocket error: ", event);
    });
  }

  //connect();

  useEffect(() => {
    const patchInterval = setInterval(() => {
      const apiUrl = `/api/fun/pats/update/${userId}`;
      // Replace "your-collection-id" with the actual ID of the collection

      fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        body: JSON.stringify({
          data: {
            amount: patCount,
          },
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          //console.log("PATCH request success:", data);
        })
        .catch((error) => {
          console.error("PATCH request error:", error);
        });
    }, 10000);

    return () => {
      clearInterval(patchInterval);
    };
  }, [userId, patCount]);

  const handlePatClick = () => {
    // Increase the pat count by 1 when the button is clicked
    setPatCount((prevCount) => prevCount + 1);
  };

  //console.log(patCount);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="sticky top-8 hidden w-44 shrink-0 lg:block">
          <div className="overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 border">
            <dt className="truncate text-sm font-medium">Total Count:</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {totalCount}
            </dd>
          </div>
          <div className="overflow-hidden rounded-lg px-4 py-5 shadow sm:p-6 mt-6 border">
            <dt className="truncate text-sm font-medium">Dein Pat Count:</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight">
              {patCount}
            </dd>
          </div>
        </aside>

        <main className="flex-1">
          <img
            src="/images/Headpat_paw_4.0.1.png"
            alt="pat"
            className="relative w-[80%] top-96 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80 transition active:scale-75 transition-transform"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handlePatClick}
          />
        </main>

        <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
          <h2>Diese seite funktioniert nicht.</h2>
        </aside>
      </div>
    </div>
  );
}
