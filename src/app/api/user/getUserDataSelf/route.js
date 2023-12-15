import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function GET() {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Construct the URL for the external fetch
    //const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/user-data/${userId}?${queryParams}`;
    const userUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents/`;
    const accountURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account`;

    const getUserId = await fetch(userUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
    });

    if (getUserId.status === 401) {
      return NextResponse.json({ status: "200" });
    }

    const getUserIdData = await getUserId.json();

    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents?queries[]=equal("$id","${getUserIdData.documents[0].$id}")`;
    const response = await fetch(fetchURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
    });

    if (response.status === 401) {
      return NextResponse.json({ status: "200" });
    }

    const data = await response.json();

    if (data.documents.length === 0) {
      const getAccountResponse = await fetch(accountURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
      });

      const getAccountData = await getAccountResponse.json();

      const postResponse = await fetch(fetchURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          documentId: getAccountData.$id,
          data: {
            status: "Ich bin neu hier!",
            profileurl: getAccountData.name,
            displayname: getAccountData.name,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const postData = await postResponse.json();
      //console.log(postData);
      return NextResponse.json(postData, { status: 201 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    //console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
