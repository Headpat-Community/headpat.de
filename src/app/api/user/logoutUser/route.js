import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST() {
  try {
    // Correct syntax for deleting a cookie
    const cookieOptions = {
      path: "/",
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      secure: true,
      httpOnly: true,
    };

    // Delete the specified cookie
    cookies().set(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      "",
      { ...cookieOptions, expires: new Date(0) }
    );
    cookies().set(`logged_in`, "", { ...cookieOptions, expires: new Date(0) });

    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
