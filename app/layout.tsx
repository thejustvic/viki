import '@/scss/app.scss'

import GlobalProvider from '@/components/global/global-provider'
import {ModalCreateTeam} from '@/components/team/modal-create-team'
import {ModalCreateTeamMember} from '@/components/team/modal-create-team-member'
import {ModalTeam} from '@/components/team/modal-team'
import TeamProvider from '@/components/team/team-provider'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {getServerTheme} from '@/utils/supabase-utils/get-server-theme'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'
import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {cookies} from 'next/headers'
import {PropsWithChildren} from 'react'
import {ModalCreatePost} from './posts/components/modal-create-post/modal-create-post'

export const metadata = {
  title: 'hobby',
  description: 'hobby app'
}

export default async function RootLayout({children}: PropsWithChildren) {
  const user = await getServerUser()
  const session = await getServerSession()

  const serverTheme = await getServerTheme(user)
  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get('theme')?.value
  const theme = serverTheme || cookieTheme

  return (
    <html data-theme={theme || 'dark'} lang="en">
      <body>
        <SupabaseProvider user={user} session={session}>
          <GlobalProvider serverTheme={theme}>
            <TeamProvider>
              <Modals />
              {children}
            </TeamProvider>
          </GlobalProvider>
        </SupabaseProvider>
        <Analytics mode="production" />
        <SpeedInsights />
      </body>
    </html>
  )
}

const Modals = () => {
  return (
    <>
      <ModalTeam />
      <ModalCreateTeam />
      <ModalCreatePost />
      <ModalCreateTeamMember />
    </>
  )
}
