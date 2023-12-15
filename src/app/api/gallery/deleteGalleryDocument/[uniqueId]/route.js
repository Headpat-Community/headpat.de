import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function DELETE(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Assume the last segment of the URL is the gallery ID
    const uniqueId = request.url.split("/").pop();

    if (!uniqueId) {
      return NextResponse.error(400, "Gallery ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents/${uniqueId}`;

    const response = await fetch(fetchURL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update data: ${errorData}`);
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
