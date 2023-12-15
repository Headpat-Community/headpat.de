import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function GET(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Assume the last segment of the URL is the user ID
    const galleryId = request.url.split("/").pop();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents/${galleryId}`;

    const response = await fetch(fetchURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
