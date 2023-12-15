'use server'
const PATS_API = `${process.env.NEXT_PUBLIC_DOMAIN}/api/fun/pats`;

export const createPatData = async (id) => {
  await fetch(`${PATS_API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        users_permissions_user: id,
      },
    }),
  });
};

export const updatePatData = async (userId) => {
  const currentPatResponse = await fetch(`${PATS_API}/${userId}`);
  const currentPatData = await currentPatResponse.json();
  const patId = currentPatData?.data[0]?.id;

  const currentCount = Number(currentPatData?.data[0]?.attributes?.count);
  const newCount = currentCount + 1;

  await fetch(`${PATS_API}/update/${patId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        count: newCount,
      },
    }),
  });

  // Fetch the total count again and update the state
  const updatedTotalResponse = await fetch(PATS_API);
  const updatedTotalData = await updatedTotalResponse.json();
  const updatedTotalCount = updatedTotalData.data.reduce(
    (acc, pat) => acc + Number(pat.attributes.count),
    0
  );

  return { updatedTotalCount, newCount };
};
