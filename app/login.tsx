'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import Image from 'next/image'

// Supabase auth needs to be triggered client-side
export default function Login() {
  const {supabase, session} = useSupabase()

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }

  async function handleGoogleLogin() {
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  console.log(session)

  return session ? (
    <>
      <Image
        width={100}
        height={100}
        src={session.user.user_metadata?.avatar_url}
        alt="avatar_url"
      />
      <button onClick={handleLogout}>Logout</button>
    </>
  ) : (
    <>
      <button onClick={handleGitHubLogin}>GitHub Login</button>
      <button onClick={handleGoogleLogin}>Google Login</button>
    </>
  )
}
