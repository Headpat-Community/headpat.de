import Header from "@/components/header";
import Footer from "@/components/footer";
import Client from "./page.client";
import Loading from "@/app/loading";
import { Suspense } from "react";

export const metadata = {
  title: "Headpat Clicker Leaderboard",
  description: "Headpat clicker Leaderboard für Headpawties!",
};

export default async function PatLeaderBoard() {

  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
      <Footer />
    </>
  );
}
