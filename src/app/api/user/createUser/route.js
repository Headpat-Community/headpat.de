import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Response-Format": "1.4.0",
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 409) {
      return NextResponse.json(
        {
          message:
            "A user with the same id, email, or phone already exists in this project.",
        },
        { status: 409 }
      );
    }

    if (!response.ok) {
      console.log(response.status);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
