import Link from "next/link";
import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title: "Impressum",
};

export default function Loading() {
  return (
    <>
      <Header />
      <div className="px-6 py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7">
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Impressum
          </h1>
          <br />
          <p>Information according to § 5 TMG.</p>
          <br />
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Contact
          </h1>
          <br />
          <p>Only on request: help@headpat.de</p>
          <br />
          <p>
            <strong>Contact info</strong>
          </p>
          <p>E-Mail: help@headpat.de</p>
          <p>Webseite: https://headpat.de</p>
          <br />
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Online dispute reoslution
          </h1>
          <p>
            The European Comission provides a platform for online dispute
            resolution, available here:{" "}
            <Link
              className="text-indigo-600 hover:text-indigo-500"
              href="https://ec.europa.eu/consumers/odr/"
            >
              https://ec.europa.eu/consumers/odr/
            </Link>
            <br />
            <br />I am neither willing nor obliged to participate in dispute
            resolution proceedings in front of a consumer arbitration board.
          </p>
          <br />
        </div>
      </div>
      <Footer />
    </>
  );
}
