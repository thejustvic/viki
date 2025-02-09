import {useSearchParams} from 'next/navigation'

export const getSearchPost = (): string | null => {
  const searchParams = useSearchParams()
  return searchParams.get('post')
}
