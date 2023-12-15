import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/recovery`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 405) {
      return NextResponse.error("Method Not Allowed", { status: 405 });
    }

    if (!response.ok) {
      console.log(response.status + " " + response.statusText);
      return NextResponse.error("Internal Server Error", { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
