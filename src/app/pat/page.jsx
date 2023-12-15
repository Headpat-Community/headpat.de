import Client from "./page.client";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata = {
  title: "Headpat Clicker",
  description: "Headpat clicker für Headpawties!",
};

export default function Pat() {
  return (
    <>
      <Header />
      <Client />
      <Footer />
    </>
  );
}
