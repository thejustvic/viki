import '@/scss/app.scss'
import {getServerSession} from '@/utils/supabase-utils/get-server-session'
import SupabaseListener from '@/utils/supabase-utils/supabase-listener'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'

export const metadata = {
  title: 'viki',
  description: 'viki app'
}

// do not cache this layout
export const revalidate = 0

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({children}: Props) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body>
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}
