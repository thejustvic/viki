import '@/scss/app.scss'

import GlobalProvider from '@/components/global/global-provider'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import {getServerTheme} from '@/utils/supabase-utils/get-server-theme'
import {getServerUser} from '@/utils/supabase-utils/get-server-user'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'
import {Analytics} from '@vercel/analytics/react'
import {cookies} from 'next/headers'
import {PropsWithChildren} from 'react'
import {ModalCreatePost} from './posts/components/modal-create-post/modal-create-post'

export const metadata = {
  title: 'hobby',
  description: 'hobby app'
}

// do not cache this layout
export const revalidate = 0

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
          <GlobalProvider serverTheme={theme} session={session}>
            <ModalCreatePost />
            {children}
          </GlobalProvider>
        </SupabaseProvider>
        <Analytics />
      </body>
    </html>
  )
}
