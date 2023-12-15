import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request) {
  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/recovery`;

    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.log(response.status + " " + response.statusText);
      return NextResponse.json(response.statusText, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
