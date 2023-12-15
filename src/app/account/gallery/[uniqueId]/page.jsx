import Layout from "@/app/layouts/account-layout";
import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "Account Gallery",
};

const ImageAccountTools = () => {
  return (
    <Layout>
      <Client />
    </Layout>
  );
};

export default ImageAccountTools;
