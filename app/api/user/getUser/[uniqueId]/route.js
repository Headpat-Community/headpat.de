import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    // Extract query parameters from the incoming request
    const queryParams = new URLSearchParams(
      request.url.split("?")[1]
    ).toString();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/users/${userId}?${queryParams}`;

    const response = await fetch(fetchURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (response.status === 403) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
