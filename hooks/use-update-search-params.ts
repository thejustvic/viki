'use client'

import {usePathname, useSearchParams} from 'next/navigation'

type UpdateSearchParamsFunc = (key: string, value?: string) => void

export const useUpdateSearchParams = (): UpdateSearchParamsFunc => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateSearchParams = (key: string, value?: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key) // Removes the key if value is empty
    }
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    history.pushState(null, '', url)
  }

  return updateSearchParams
}
