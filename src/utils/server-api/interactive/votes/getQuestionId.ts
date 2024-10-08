import { createAdminClient } from '@/app/appwrite-session'
import { Interactive } from '@/utils/types/models'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the answers of the votes of Lighthase's EF Panel.
 * @returns The question ID.
 * @example
 * const questionId = await getQuestionId()
 */
export async function getVotingSystem(): Promise<Interactive.VotesSystem> {
  unstable_noStore()
  const { databases } = await createAdminClient()
  return await databases
    .getDocument('interactive', 'system', 'main')
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
