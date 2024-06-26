import { createSessionServerClient } from '@/app/appwrite-session'
import { Followers } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the followers of a user.
 * @param {string} userId The user id.
 * @returns {Promise<Followers.FollowerDocumentsType>} The followers of the user.
 * @example
 * const followers = await getFollowers('user_id')
 * userId:
 */
export async function getFollowers(
  userId: string
): Promise<Followers.FollowerType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'followers', [Query.equal('followerId', userId)])
    .catch((error) => {
      return error
    })
}
