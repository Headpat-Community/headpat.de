"use client";
import { useEffect, useState } from "react";

export default function PatLeaderBoardClient({ usersData }) {
  const [userData, setUserData] = useState([]);
  const [patsLeaderboard, setPatsLeaderboard] = useState([]);

  const getAvatarImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/fun/pats`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!Array.isArray(responseData)) {
        console.error("Invalid data format received from the API");
        return;
      }

      const patsData = [];

      for (const item of responseData) {
        const userId = item.$id;
        const userResponse = await fetch(`/api/user/getUserProfileFilter`, {
          method: "GET",
        });
        const userData = await userResponse.json();

        const displayName = userData.documents[0].displayname || "Unknown User";

        patsData.push({
          id: userId,
          amount: item.amount,
          displayname: displayName,
          modifiedAt: new Date(item.$updatedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatarId: userData.documents[0].avatarId,
        });
      }

      const sortedData = patsData.sort((a, b) => b.amount - a.amount);

      setPatsLeaderboard(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Geklickt
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold"
                  >
                    Als letztes geklickt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patsLeaderboard.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            className="h-11 w-11 rounded-full"
                            src={getAvatarImageUrl(user.avatarId)}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{user.displayname}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="">{user.amount}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm">
                      <div className="">{user.modifiedAt}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
