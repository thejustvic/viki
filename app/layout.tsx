import '@/scss/app.scss'
import 'simplebar-react/dist/simplebar.min.css'

import CardChecklistProvider from '@/components/cards/card-checklist/card-checklist-provider'
import CardInfoProvider from '@/components/cards/card-info/card-info'
import CardsProvider from '@/components/cards/cards'
import {ModalCardCreate} from '@/components/cards/modal-card/modal-card-create'
import {ModalCardDelete} from '@/components/cards/modal-card/modal-card-delete'
import {ModalVisualTab} from '@/components/cards/visual/ui/modal-visual'
import ChatProvider from '@/components/chat/chat-provider'
import {DrawerWrapper} from '@/components/common/drawer/drawer-wrapper'
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
import type {Metadata} from 'next'
import {cookies} from 'next/headers'
import {PropsWithChildren} from 'react'

export const metadata: Metadata = {
  title: 'crm',
  description: 'crm app'
}

export default async function RootLayout({children}: PropsWithChildren) {
  const serverSession = await getServerSession()
  const serverUser = await getServerUser()
  const serverProfile = await getServerProfile(serverUser)

  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get('theme')?.value
  const theme = serverProfile?.theme ?? cookieTheme
  const currentTeamId = serverProfile?.current_team_id ?? null

  return (
    <html data-theme={theme ?? 'dark'} lang="en">
      <body>
        <SupabaseProvider serverUser={serverUser} serverSession={serverSession}>
          <GlobalProvider serverTheme={theme}>
            <TeamProvider currentTeamId={currentTeamId}>
              <ChatProvider>
                <CardsProvider>
                  <CardInfoProvider>
                    <CardChecklistProvider>
                      <Modals />
                      <DrawerWrapper>{children}</DrawerWrapper>
                    </CardChecklistProvider>
                  </CardInfoProvider>
                </CardsProvider>
              </ChatProvider>
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
      <ModalCardCreate />
      <ModalCardDelete />
      <ModalTeam />
      <ModalCreateTeam />
      <ModalCreateTeamMember />
      <ModalVisualTab />
    </>
  )
}
