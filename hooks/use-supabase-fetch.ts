import {PostgrestBuilder, PostgrestError} from '@supabase/postgrest-js' // Ensure correct import
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
    if (!postgrestBuilder) {
      return
    }

    isFetching.current = true

    const fetchData = async (): Promise<void> => {
      setResult(prev => ({...prev, loading: true})) // Only update `loading`

      try {
        const response = postgrestBuilder()

        if (!response) {
          return
        }

        const {data, error} = await response

        if (typeof data !== 'object') {
          console.error('Unexpected response:', data)
          return
        }

        setResult({
          loading: false,
          data: error ? null : data,
          error: error ?? null
        })
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

    return () => {
      setResult(prev => ({...prev, loading: false})) // Cleanup: stop loading if unmounted
    }
  }, deps)

  return result
}
