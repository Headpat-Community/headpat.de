import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function GET() {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564499f223ba3233ca/documents`;

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
      console.log(response.status, response.statusText);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data.documents, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
