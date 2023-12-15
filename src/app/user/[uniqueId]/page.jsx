import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "User Profile",
  description: "User Profile Description",
}

export default function UserProfile() {
  return (
    <>
      <Header />
      <Client />
      <Footer />
    </>
  );
}
