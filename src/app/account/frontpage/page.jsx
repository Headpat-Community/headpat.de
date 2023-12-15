import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <>
      <Layout>
        <Client />
      </Layout>
    </>
  );
}
