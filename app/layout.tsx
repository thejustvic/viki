import '@/scss/app.scss'
import SupabaseListener from '@/utils/supabase-utils/supabase-listener'
import SupabaseProvider from '@/utils/supabase-utils/supabase-provider'
import {createClient} from '@/utils/supabase-utils/supabase-server'

export const metadata = {
  title: 'viki',
  description: 'viki app'
}

// do not cache this layout
export const revalidate = 0

interface Props {
  children: React.ReactNode
}

export default async function RootLayout(props: Props) {
  const supabase = createClient()

  const {
    data: {session}
  } = await supabase.auth.getSession()

  const {children} = props
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
