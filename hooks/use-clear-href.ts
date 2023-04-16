import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

export const useClearHref = (): void => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [])
}
