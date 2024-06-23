import { createSessionServerClient } from '@/app/appwrite-session'
import { Card } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeIcon, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import PageLayout from '@/components/pageLayout'
import { UserData } from '@/utils/types/models'
import { Link } from '@/navigation'

export const runtime = 'edge'

export default async function Users() {
  const { databases } = await createSessionServerClient()

  const usersData = await databases.listDocuments('hp_db', 'userdata')
  const users = usersData.documents

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  const getAvatarUrl = (avatarId: string) => {
    if (!avatarId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${avatarId}/preview?project=6557c1a8b6c2739b3ecf&width=250&height=250`
  }

  return (
    <PageLayout title={'Users'}>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
        }
      >
        {users.map((user: UserData.UserDataDocumentsType) => {
          const today = formatDate(new Date())
          const birthday = user.birthday
            ? formatDate(new Date(user.birthday))
            : '01/01/1900'

          const isBirthday = birthday !== '01/01/1900' && birthday === today

          return (
            <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
              <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <div className={'h-full w-full'}>
                    <Link
                      href={{
                        pathname: '/user/[profileUrl]',
                        params: { profileUrl: user.profileUrl },
                      }}
                    >
                      {user.avatarId ? (
                        <Image
                          src={getAvatarUrl(user.avatarId) || null}
                          alt={user.displayName}
                          className="object-cover rounded-md"
                          width={1000}
                          height={1000}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center">
                          <p className="text-gray-400 text-center font-mono truncate px-2">
                            {user.displayName}
                          </p>
                        </div>
                      )}
                    </Link>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src={getAvatarUrl(user.avatarId) || null} />
                      <AvatarFallback>
                        {user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{`@${user.displayName}`}</h4>
                      <p className="text-sm flex-wrap">{user.status}</p>
                      {isBirthday && (
                        <div className="flex items-center pt-2">
                          <CakeIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                          <span className="text-xs text-muted-foreground">
                            Today is my birthday!
                          </span>
                        </div>
                      )}
                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-xs text-muted-foreground">
                          Joined {formatDate(new Date(user.$createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          )
        })}
      </div>
    </PageLayout>
  )
}