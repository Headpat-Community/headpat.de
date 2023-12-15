import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    const uniqueId = new URL(request.url).pathname.split("/").pop();

    // Read the entire stream and buffer it
    const requestData = await request.arrayBuffer();

    // See if user has an avatar already
    const avatarResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents?queries[]=equal("userId","${uniqueId}")`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
      }
    );

    const avatarData = await avatarResponse.json();
    const avatarDocumentId = avatarData?.documents[0]?.$id;
    const avatarGalleryId = avatarData?.documents[0]?.gallery_id;
    // If user has an avatar, delete it

    if (avatarData.documents.length !== 0) {
      const deleteURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${avatarGalleryId}`;

      const deleteResponse = await fetch(deleteURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
      });

      //const deleteData = await deleteResponse.json();

      const deleteDocURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents/${avatarDocumentId}`;

      const deleteDocResponse = await fetch(deleteDocURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
      });
    }

    const uploadImage = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            request.headers.get("Content-Type") || "multipart/form-data",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
        body: requestData,
      }
    );

    const imageData = await uploadImage.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655f6354b7c3fff1d687/documents`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          documentId: "unique()",
          data: {
            gallery_id: imageData.$id,
            sizeOriginal: imageData.sizeOriginal,
            userId: uniqueId,
          },
        }),
      }
    );

    // PATCH the userdata with the new avatar id
    const patchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents/${uniqueId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          data: {
            avatarId: imageData.$id,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to POST data: ${errorData}`);
    }

    if (!patchResponse.ok) {
      const errorData = await patchResponse.text();
      throw new Error(`Failed to PATCH data: ${errorData}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
