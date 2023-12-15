import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/sessions/email`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
      },
      body: JSON.stringify(requestBody),
    });
    //console.log(response.status);

    if (!response.ok) {
      //console.log(response.statusText);
      return NextResponse.json(response.statusText, { status: 500 });
    }

    const data = await response.json();

    const setCookieHeader = response.headers.get("Set-Cookie");
    if (setCookieHeader) {
      const cookiesToSet = setCookieHeader.split(", ");
      cookiesToSet.forEach((cookie) => {
        const [cookieNameAndValue, ...cookieAttrs] = cookie.split("; ");
        const [cookieName, cookieValue] = cookieNameAndValue.split("=");

        // Skip this iteration if the cookie name includes "legacy"
        if (cookieName.includes("_legacy")) {
          return;
        }

        const cookieOptions = cookieAttrs.reduce((options, attr) => {
          const [attrName, attrValue] = attr.split("=");
          options[attrName.toLowerCase()] = attrValue || true;
          return options;
        }, {});

        cookies().set(cookieName, cookieValue, {
          path: "/",
          secure: true,
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          domain: cookieOptions.domain || process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
          httpOnly: true,
        });
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    //console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
