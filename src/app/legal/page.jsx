import { PaperClipIcon } from "@heroicons/react/20/solid";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Legal",
};

export default function LegalPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl mt-8 mb-4">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7">
            Legal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            All the legal information about our website and app.
          </p>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                About
              </dt>
              <dd className="mt-1 text-sm leading-6 dark:text-white/80 text-black/80 sm:col-span-2 sm:mt-0">
                Here you can download all the legal documents that are related
                to the use of our website or app. If you have any questions,
                please contact us at{" "}
                <Link
                  className="text-indigo-600 hover:text-indigo-500"
                  href="mailto:help@headpat.de"
                >
                  help@headpat.de
                </Link>
                .
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Attachments
              </dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <ul
                  role="list"
                  className="divide-y divide-gray-100 rounded-md border dark:border-gray-200 border-gray-700"
                >
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          Impressum.notapdf
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/impressum"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Go to page
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          termsofservice.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          243 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/termsofservice.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          privacypolicy.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          265 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/privacypolicy.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          disclaimer.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          40 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/disclaimer.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          acceptableuse.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          99 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/acceptableuse.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>
                  {/*<li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          returnpolicy.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          27 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/returnpolicy.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>*/}
                  <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">
                          shippingpolicy.pdf
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          27 kb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        href="/legal/returnpolicy.pdf"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </Link>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <Footer />
    </>
  );
}
