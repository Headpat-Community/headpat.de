import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = {
  title: "Account Settings",
};

export default function AccountSettings() {
  return (
    <>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Client />
        </Suspense>
      </Layout>
    </>
  );
}
