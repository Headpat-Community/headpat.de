import { createSessionServerClient } from '@/app/appwrite-session'
import NoAccess from '@/components/static/noAccess'
import PageLayout from '@/components/pageLayout'
import { Separator } from '@/components/ui/separator'
import {
  IntroductionClient,
  MainClient,
} from '@/app/[locale]/(admin)/d&d/page.client'

export const runtime = 'edge'

export default async function Page() {
  const { account } = await createSessionServerClient()

  try {
    const data = await account.get()
    if (!data.labels.includes('admin')) {
      return <NoAccess />
    }
  } catch (error) {
    return <NoAccess />
  }

  return (
    <PageLayout title={'D&D Admin Panel'}>
      <div className={'p-4'}>
        <h1 className={'text-2xl'}>Introduction:</h1>
        <p className={'text-muted-foreground'}>
          This is the admin panel for the D&D panel. Here you can manage the
          selected questions and answers.
        </p>
        <Separator className={'my-4'} />
        <IntroductionClient />
      </div>
      <div className={'p-4 mt-8'}>
        <h1 className={'text-2xl'}>Main:</h1>
        <p className={'text-muted-foreground'}>
          This is the main panel for the D&D panel. Here you can manage the
          selected questions and answers.
        </p>
        <Separator className={'my-4'} />
        <MainClient />
      </div>
    </PageLayout>
  )
}
