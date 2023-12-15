import "../../css/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Headpat Community",
    template: "%s - Headpat",
  },
  description: "Social network für headpawties",
  keywords: ["headpat", "community", "social", "network"],
  lang: "de",
  image: "/logos/logo-512.webp",
  url: "https://headpat.de",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de" className="h-full" suppressHydrationWarning >
      <body className={`${inter.className} flex min-h-full bg-white antialiased dark:bg-black`}>
        <Providers>
          <div className="w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
