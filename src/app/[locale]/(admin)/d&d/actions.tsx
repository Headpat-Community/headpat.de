'use server'

import { createAdminClient } from '@/app/appwrite-session'

export async function pauseVoting(collectionId: string) {
  const { databases } = await createAdminClient()
  const data = await databases.getDocument(
    'interactive',
    `${collectionId}`,
    'main'
  )
  return await databases.updateDocument(
    'interactive',
    `${collectionId}`,
    'main',
    {
      paused: !data.paused,
    }
  )
}

export async function previousIntroductionQuestion() {
  const { databases } = await createAdminClient()
  const data = await databases.getDocument('interactive', 'system', 'main')
  if (data.questionId === 0) {
    return false
  }
  return await databases.updateDocument('interactive', 'system', 'main', {
    questionId: data.questionId - 1,
  })
}

export async function nextIntroductionQuestion() {
  const { databases } = await createAdminClient()
  const data = await databases.getDocument('interactive', 'system', 'main')
  if (data.questionId === 7) {
    return false
  }
  return await databases.updateDocument('interactive', 'system', 'main', {
    questionId: data.questionId + 1,
  })
}

export async function updateSystem(name: string) {
  const { databases } = await createAdminClient()
  return await databases.updateDocument('interactive', 'system', 'main', {
    questionId: name,
  })
}

export async function updateMainSystem(name: string) {
  const { databases } = await createAdminClient()
  return await databases.updateDocument('interactive', 'system-main', 'main', {
    questionId: name,
  })
}
