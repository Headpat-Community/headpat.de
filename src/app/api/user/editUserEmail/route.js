import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function PATCH(request) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie");

  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/email`;

    const response = await fetch(fetchURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 400) {
      const data = await response.json();
      return NextResponse.json(data, { status: 400 });
    }

    if (response.status === 401) {
      const data = await response.json();
      return NextResponse.json(data, { status: 401 });
    }

    if (response.status === 409) {
      const data = await response.json();
      return NextResponse.json(data, { status: 409 });
    }

    if (!response.ok) {
      console.log(response.status + " " + response.statusText);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
