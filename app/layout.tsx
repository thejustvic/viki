import '@/scss/app.scss'

import ChatProvider from '@/components/chat/chat-provider'
import Wrapper from '@/components/common/wrapper'
import GlobalProvider from '@/components/global/global-provider'
import {getServerChat} from '@/utils/supabase-utils/get-server-chat'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {getServerTheme} from '@/utils/supabase-utils/get-server-theme'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'
import {Analytics} from '@vercel/analytics/react'
import {cookies} from 'next/headers'

export const metadata = {
  title: 'hobby',
  description: 'hobby app'
}

// do not cache this layout
export const revalidate = 0

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({children}: Props) {
  const user = await getServerUser()
  const session = await getServerSession()
  const serverChat = await getServerChat()
  const serverTheme = await getServerTheme(user)
  const cookieStore = await cookies()
  const cookieTheme = cookieStore.get('theme')?.value
  const theme = serverTheme || cookieTheme

  return (
    <html data-theme={theme || 'dark'} lang="en">
      <body>
        <SupabaseProvider user={user} session={session}>
          <GlobalProvider serverTheme={theme} session={session}>
            <ChatProvider serverChat={serverChat ?? []}>
              <Wrapper>{children}</Wrapper>
            </ChatProvider>
          </GlobalProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
