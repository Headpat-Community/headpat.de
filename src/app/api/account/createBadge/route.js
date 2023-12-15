import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    // Get the raw body data as ArrayBuffer
    const requestData = await request.arrayBuffer();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/6561407c0697498ea08d/files`;

    const uploadImage = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("Content-Type") || "multipart/form-data",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
      body: requestData,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
