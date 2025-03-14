import {PostgrestBuilder, PostgrestError} from '@supabase/postgrest-js' // Ensure correct import
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
  const [result, setResult] = useState<SupabaseQuery<T>>({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    if (!postgrestBuilder) {
      return
    }

    let isMounted = true // Prevents updating state after unmounting

    const fetchData = async (): Promise<void> => {
      setResult(prev => ({...prev, loading: true})) // Only update `loading`

      try {
        const {data, error} = await postgrestBuilder()

        if (isMounted) {
          setResult({
            loading: false,
            data: error ? null : data,
            error: error ?? null
          })
        }
      } catch (e) {
        console.error('Supabase fetch error:', e)
        if (isMounted) {
          setResult({
            loading: false,
            data: null,
            error: e as PostgrestError // Type assertion for better TS handling
          })
        }
      }
    }

    void fetchData()

    return () => {
      isMounted = false
      setResult(prev => ({...prev, loading: false})) // Cleanup: stop loading if unmounted
    }
  }, deps)

  return result
}
