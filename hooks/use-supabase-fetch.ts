import type {PostgrestBuilder, PostgrestError} from '@supabase/postgrest-js'
import {useEffect, useState} from 'react'

export interface SupabaseQuery<T> {
  loading: boolean
  data: T | null
  error: PostgrestError | null
}

export const useSupabaseFetch = <T>(
  postgrestBuilder: null | (() => PostgrestBuilder<T>),
  deps: unknown[]
): SupabaseQuery<T> => {
  const isBuilderExist = typeof postgrestBuilder === 'function'
  const [result, setResult] = useState<SupabaseQuery<T>>({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    if (!isBuilderExist) {
      return
    }
    void (async (): Promise<void> => {
      setResult({
        loading: true,
        data: null,
        error: null
      })
      const {data, error} = await postgrestBuilder()
      if (error) {
        setResult({
          loading: false,
          data: null,
          error
        })
      } else {
        setResult({
          loading: false,
          data,
          error: null
        })
      }
    })()

    return () =>
      setResult({
        loading: false,
        data: null,
        error: null
      })
  }, deps)

  return result
}
