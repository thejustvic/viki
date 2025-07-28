import '@/scss/app.scss'

import {ModalCreateCard} from '@/components/cards/modal-create-card/modal-create-card'
import GlobalProvider from '@/components/global-provider/global-provider'
import {ModalCreateTeam} from '@/components/team/modal-create-team'
import {ModalCreateTeamMember} from '@/components/team/modal-create-team-member'
import {ModalTeam} from '@/components/team/modal-team'
import TeamProvider from '@/components/team/team-provider'
import {getServerProfile} from '@/utils/supabase-utils/get-server-profile'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'
import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {cookies} from 'next/headers'
import {PropsWithChildren} from 'react'

export const metadata = {
  title: 'hobby',
  description: 'hobby app'
}

export default async function RootLayout({children}: PropsWithChildren) {
  const session = await getServerSession()
  const serverUser = await getServerUser()
  const profile = await getServerProfile(serverUser)

  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get('theme')?.value
  const theme = profile?.theme || cookieTheme

  return (
    <html data-theme={theme ?? 'dark'} lang="en">
      <body>
        <SupabaseProvider serverUser={serverUser} session={session}>
          <GlobalProvider serverTheme={theme}>
            <TeamProvider serverCurrentTeamId={profile?.current_team_id}>
              <Modals />
              {children}
            </TeamProvider>
          </GlobalProvider>
        </SupabaseProvider>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics mode="production" />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}

const Modals = () => {
  return (
    <>
      <ModalTeam />
      <ModalCreateTeam />
      <ModalCreateCard />
      <ModalCreateTeamMember />
    </>
  )
}
