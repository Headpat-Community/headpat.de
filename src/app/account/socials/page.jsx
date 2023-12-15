import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const metadata = {
  title: "Socials",
};

export default function SocialSettings() {

  return (
    <>
      <Layout>
        <Client />
      </Layout>
    </>
  );
}
