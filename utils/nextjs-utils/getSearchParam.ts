import {useSearchParams} from 'next/navigation'

export const getSearchParam = (value: string): string | null => {
  return useSearchParams().get(value)
}
