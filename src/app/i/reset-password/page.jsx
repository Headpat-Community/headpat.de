"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import { ErrorMessage } from "@/components/alerts";

const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get("userId");
    const codeParam = urlParams.get("secret");
    if (userIdParam) {
      setUserId(userIdParam);
    }
    if (codeParam) {
      setCode(codeParam);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/resetPassword", {
        method: "PUT",
        body: JSON.stringify({
          userId: userId,
          secret: code,
          password: password,
          passwordAgain: confirmPassword,
        }),
      });
      //console.log("User authenticated successfully");
      if (response.status === 400) {
        setError(
          `Incorrect credentials or already made account! We tried everything, It's just not possible.`
        );
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 429) {
        setError("Too many requests!");
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 500) {
        setError("Server error!");
        setTimeout(() => {
          setError("");
        }, 5000);
      } else if (response.status === 200) {
        window.location.href = "/login";
      }
    } catch (error) {
      //console.log(error);
      setError("Passwort stimmt nicht!");
    }
  };

  return (
    <>
      {error && <ErrorMessage attentionError={error} />}
      <Header />
      <div className="flex lg:pt-[200px] justify-center items-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col justify-center">
          <Image
            className="mx-auto h-24 w-auto"
            src="/logos/Headpat_new_logo.webp"
            alt="Headpat Logo"
            width={128}
            height={128}
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Reset Password
          </h2>

          <form className="mt-10 space-y-6" action="#" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                User ID
              </label>
              <div className="mt-2">
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Code
              </label>
              <div className="mt-2">
                <input
                  id="code"
                  name="code"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Password:
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="newpassword"
                  name="newpassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Confirm Password:
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  autoComplete="confirm-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleSubmit}
              >
                Reset Password
              </button>
            </div>
            <div>
              <Link
                href="/register"
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Account erstellen &rarr;
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
