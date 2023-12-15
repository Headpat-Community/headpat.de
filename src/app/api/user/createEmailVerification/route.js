import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function POST() {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    const sendEmailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/account/verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.4.0",
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          url: `${process.env.NEXT_PUBLIC_DOMAIN}/i/verify-email`,
        }),
      }
    );

    if (!sendEmailResponse.ok) {
      console.log(
        sendEmailResponse.status + " " + sendEmailResponse.statusText
      );
      return NextResponse.json(
        { message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
