'use client'
import { useEffect, useState } from "react";

export default function LogoutPage() {
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/user/logoutUser`, {
      method: "POST",
    })
    .then(response => {
      if (!response.ok) { throw response; }
      return response.json();  // we only get here if there is no error
    })
    .then(() => {
      window.location.href = "/";
    })
    .catch(err => {
      setError(err);
    });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return null;
}