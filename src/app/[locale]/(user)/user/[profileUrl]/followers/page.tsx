import { getUserDataFromProfileUrl } from '@/utils/server-api/user/getUserData'
import ClientPage from './page.client'
import { createSessionServerClient } from '@/app/appwrite-session'
import { UserData } from '@/utils/types/models'
import { Query } from '@/app/appwrite-server'
import sanitizeHtml from 'sanitize-html'
import { getAvatarImageUrlView } from '@/components/getStorageItem'

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
  const userData = userDataResponse.documents[0]
  const sanitizedBio = sanitizeHtml(userData.bio)

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

export default async function FollowerPage({
  params: { locale, profileUrl },
}: {
  params: { locale: string; profileUrl: string }
}) {
  const userData = await getUserDataFromProfileUrl(profileUrl)

  return <ClientPage userData={userData} />
}
