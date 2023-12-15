import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  const headersList = headers();
  const cookieHeader = headersList.get("cookie");

  try {
    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/jwt`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookies: cookieHeader,
      },
    });

    if (!response.ok) {
      console.log(response.statusText);
      return NextResponse.json(response.statusText, { status: 500 });
    }

    const data = await response.json();

    cookies().set("jwt", data.jwt, {
      path: "/",
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
