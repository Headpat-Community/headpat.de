import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function PATCH(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    const requestBody = await request.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655caf2e7a6d01e18184/documents/${userId}`;

    const response = await fetch(fetchURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody), // Serialize requestBody to JSON
    });

    if (!response.ok) {
      console.log(response.status, response.statusText);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
