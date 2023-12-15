import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";

export const runtime = "edge";

export default function FetchGallery() {
  return (
    <>
      <Header />
      <Client />
      <Footer />
    </>
  );
}
