import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from '@/app/appwrite-server'
import { getAvatarImageUrlView } from '@/components/getStorageItem'
import PageClient from './page.client'
import { UserData } from '@/utils/types/models'
import sanitizeHtml from 'sanitize-html'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

export async function generateMetadata({
  params: { profileUrl, locale },
}: {
  params: { profileUrl: string; locale: string }
}) {
  const { databases } = await createSessionServerClient()
  const userDataResponse: UserData.UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )

  if (userDataResponse.total === 0) {
    return notFound()
  }

  const userData = userDataResponse?.documents[0]
  const sanitizedBio = sanitizeHtml(userData?.bio)

  return {
    title: userData.displayName || userData?.profileUrl,
    description: sanitizedBio,
    icons: {
      icon: getAvatarImageUrlView(userData.avatarId),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/user/${profileUrl}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/user/${profileUrl}`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/user/${profileUrl}`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/user/${profileUrl}`,
      },
    },
    openGraph: {
      title: userData.displayName || userData?.profileUrl,
      description: sanitizedBio,
      images: getAvatarImageUrlView(userData.avatarId),
      locale: locale,
      type: 'profile',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function UserProfile({ params: { profileUrl } }) {
  const { databases } = await createSessionServerClient()

  const userDataResponse: UserData.UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )

  return (
    <PageClient
      user={userDataResponse.documents[0]}
      userId={userDataResponse.documents[0].$id}
    />
  )
}
