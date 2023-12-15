import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "Announcements",
};

export default function Page() {
  return (
    <>
      <Header />
      <Client />
      <Footer />
    </>
  );
}
