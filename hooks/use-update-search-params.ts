'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'

type UpdateSearchParamsFunc = (key: string, value?: string) => void

export const useUpdateSearchParams = (): UpdateSearchParamsFunc => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateSearchParams = (key: string, value?: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key) // Removes the key if value is empty
    }

    // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
    router.push(`${pathname}?${params.toString()}`, {shallow: true})
  }

  return updateSearchParams
}
