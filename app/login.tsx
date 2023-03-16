'use client'

import {useSupabase} from '@/utils/supabase-provider'

// Supabase auth needs to be triggered client-side
export default function Login() {
  const {supabase} = useSupabase()

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

  return (
    <>
      <button onClick={handleGitHubLogin}>GitHub Login</button>
      <button onClick={handleGoogleLogin}>Google Login</button>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}
