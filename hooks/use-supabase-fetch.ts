import {PostgrestBuilder, PostgrestError} from '@supabase/postgrest-js'
import {useEffect, useRef, useState} from 'react'

export interface SupabaseQuery<T> {
  loading: boolean
  data: T | null
  error: PostgrestError | null
}

export const useSupabaseFetch = <T>(
  postgrestBuilder: null | (() => PostgrestBuilder<T> | null),
  deps: unknown[]
): SupabaseQuery<T> => {
  const isFetching = useRef(false)
  const [result, setResult] = useState<SupabaseQuery<T>>({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    if (isFetching.current) {
      return
    }

    // 1. Get the query object from the builder
    const response = postgrestBuilder ? postgrestBuilder() : null

    // 2. Guard: If the builder returned null, or dependencies aren't ready, don't fetch
    if (!response) {
      return
    }

    isFetching.current = true

    const fetchData = async (): Promise<void> => {
      setResult({
        loading: true,
        data: null,
        error: null
      })
      try {
        const {data, error} = await response
        if (typeof data !== 'object') {
          console.error('Unexpected response:', data)
          return
        }
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
      } catch (e) {
        console.error('Supabase fetch error:', e)
        setResult({
          loading: false,
          data: null,
          error: e as PostgrestError // Type assertion for better TS handling
        })
      } finally {
        isFetching.current = false
      }
    }

    void fetchData()
  }, deps)

  return result
}
