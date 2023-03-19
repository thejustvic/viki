'use client'

import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import Image from 'next/image'
import {Button} from 'react-daisyui'

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

  console.log(session)

  return session ? <Logged /> : <Anonymous />
}

const Anonymous = () => {
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
  return (
    <>
      <Button onClick={handleGitHubLogin}>GitHub Login</Button>
      <Button onClick={handleGoogleLogin}>Google Login</Button>
    </>
  )
}

const Logged = () => {
  const {supabase, session} = useSupabase()
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }
  if (!session) {
    return null
  }
  return (
    <>
      <Image
        width={100}
        height={100}
        src={session.user.user_metadata?.avatar_url}
        alt="avatar_url"
      />
      <Button onClick={handleLogout}>Logout</Button>
    </>
  )
}
