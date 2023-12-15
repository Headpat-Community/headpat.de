"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ErrorMessage, SuccessMessage } from "@/components/alerts";
import { Client, Account } from "appwrite";

const client = new Client();
const account = new Account(client);

client
  .setEndpoint("https://api.headpat.de/v1") // Your API Endpoint
  .setProject("6557c1a8b6c2739b3ecf"); // Your project ID

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkIfUserExists = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/checkUserExists`,
          {
            method: "GET",
          }
        );

        if (response.status === 201) {
          window.location.href = "/account";
        } else if (response.status === 401) {
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfUserExists();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/loginUser`,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json(); // Not needed
      //console.log(data);

      if (response.status === 400) {
        setError(`Fehler: ${data.message} Bitte versuche es später erneut.`);
        setTimeout(() => {
          setError("");
        }, 7000);
      } else if (response.status === 401) {
        setError("E-Mail oder Passwort inkorrekt!");
        setTimeout(() => {
          setError("");
        }, 7000);
      } else if (response.status === 429) {
        setError("Zu viele Anfragen! Bitte versuche es später erneut.");
        setTimeout(() => {
          setError("");
        }, 7000);
      } else if (response.status === 500) {
        setError("Server fehler! Bitte versuche es später erneut.");
        setTimeout(() => {
          setError("");
        }, 7000);
      } else if (response.status === 201) {
        window.location.href = "/account";
      }
    } catch (error) {
      console.log(error);
      setError("Server fehler! Bitte versuche es später erneut.");
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };

  const handleGoogleLogin = async () => {
    /*const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/oauth/googleLogin`,
      {
        method: "GET",
      }
    );

    const data = await response.json(); // Not needed
    console.log(data);*/
    account.createOAuth2Session(
      "google",
      `${process.env.NEXT_PUBLIC_DOMAIN}/account`,
      `${process.env.NEXT_PUBLIC_DOMAIN}/login?failure=true`
    );
  };

  const handleDiscordLogin = async () => {
    account.createOAuth2Session(
      "discord",
      "https://appwrite.headpat-de.pages.dev/",
      "https://appwrite.headpat-de.pages.dev/login?failure=true"
    );

    const session = account.getSession("current");

    console.log(session.provider);
    console.log(session.providerUid);
    console.log(session.providerAccessToken);
  };

  const handleGithubLogin = async () => {
    account.createOAuth2Session(
      "github",
      `${process.env.NEXT_PUBLIC_DOMAIN}/account`,
      `${process.env.NEXT_PUBLIC_DOMAIN}/login?failure=true`
    );
  };

  const handleAppleLogin = async () => {
    account.createOAuth2Session(
      "apple",
      `${process.env.NEXT_PUBLIC_DOMAIN}/account`,
      `${process.env.NEXT_PUBLIC_DOMAIN}/login?failure=true`
    );
  };

  return (
    <>
      {error && <ErrorMessage attentionError={error} />}
      <div className="flex min-h-full flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Image
                className="h-10 w-auto"
                src="/logos/Headpat_new_logo.webp"
                alt="Headpat Community"
                width={600}
                height={600}
              />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                Einloggen in deinen Account
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Not a member?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Klick hier um dich zu registrieren!
                </Link>
              </p>
            </div>

            <div className="mt-10">
              <div>
                <form action="#" method="POST" className="space-y-6">
                  <div>
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
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset text-black dark:ring-gray-300 ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset text-black dark:ring-gray-300 ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm leading-6">
                      <Link
                        href="/forgot-password"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Anmelden
                    </button>
                  </div>
                </form>
              </div>
              {/*

              <div className="mt-8">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900 rounded-xl">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDiscordLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#5865F2] border dark:border-white/20 border-black/20 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 640 512"
                    >
                      <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Discord
                    </span>
                  </button>

                  <button
                    onClick={handleGithubLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] border dark:border-white/20 border-black/20 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </button>

                  <button
                    onClick={handleAppleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#000000] border dark:border-white/20 border-black/20 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 384 512"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Apple
                    </span>
                  </button>

                  <button
                    onClick={handleGoogleLogin}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#131314] border dark:border-white/20 border-black/20 px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                  >
                    <svg
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      className="h-5 w-5"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>

                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Login;
