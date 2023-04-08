import type {PostgrestBuilder, PostgrestError} from '@supabase/postgrest-js'
import {useEffect, useState} from 'react'

export interface Query<T> {
  loading: boolean
  data: T | null
  error: PostgrestError | null
}

export const useSupabaseFetch = <T>(
  postgrestBuilder: null | (() => PostgrestBuilder<T>),
  deps: unknown[]
): Query<T> => {
  const [result, setResult] = useState<Query<T>>({
    loading: true,
    data: null,
    error: null
  })

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      if (!deps) {
        return
      }
      if (typeof postgrestBuilder !== 'function') {
        return
      }
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
      }
      setResult({
        loading: false,
        data,
        error: null
      })
    }
    void fetch()

    return () =>
      setResult({
        loading: false,
        data: null,
        error: null
      })
  }, deps)

  return result
}
