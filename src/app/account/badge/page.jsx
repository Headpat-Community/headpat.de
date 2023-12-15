import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const metadata = {
  title: "Badge request",
};

export default function AccountBadgePage() {
  return (
    <>
      <Layout>
        <Client />
      </Layout>
    </>
  );
}
