import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const metadata = {
  title: "Upload",
};

export default function UploadPage() {
  return (
    <>
      <Layout>
        <Client />
      </Layout>
    </>
  );
}
