import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

export default function FetchGallery() {

  return (
    <Layout>
      <Client />
    </Layout>
  );
}
