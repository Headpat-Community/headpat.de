import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export const metadata = {
  title: "Pawcraft",
  description: "Minecraft Vanilla Server mit viel Spaß und Orten zum Erkunden!",
};

export default function PawcraftPage() {
  return (
    <div className="bg-gray-900">
      <div className="relative isolate">
        <Header />
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Pawcraft 3
              </h1>
              <h2 className="mt-6 text-lg leading-8 text-gray-300">
                Minecraft Vanilla Server mit viel Spaß und Orten zum Erkunden!
                <br />
              </h2>
              <span className="text-red-400">Es gibt eine Whitelist.</span>

              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="https://pawcraft.tk"
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  zur Seite →
                </Link>
              </div>
            </div>
            <Image
              src="/images/pawcraft_anzeige.webp"
              alt="App screenshot"
              width={1280}
              height={720}
              className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
