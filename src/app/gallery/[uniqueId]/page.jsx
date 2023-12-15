import Header from "@/components/header";
import Client from "./page.client";

export const runtime = "edge";

export const metadata = {
  title: "Gallerie",
  description: "Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.",
};

export default function Gallery() {
  return (
    <div>
      <Header />
      <Client />
    </div>
  );
}
