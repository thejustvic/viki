import {
  PostgrestError,
  PostgrestResponse,
  PostgrestSingleResponse
} from '@supabase/postgrest-js'
import {useEffect, useState} from 'react'

export interface SupabaseQuery<T> {
  loading: boolean
  data: T | null
  error: PostgrestError | null
}

type SupabaseRequest<T> = PromiseLike<
  PostgrestSingleResponse<T> | PostgrestResponse<T>
> & {
  abortSignal?: (signal: AbortSignal) => SupabaseRequest<T>
}

export const useSupabaseFetch = <T>(
  postgrestBuilder: null | (() => SupabaseRequest<T> | null),
  deps: unknown[]
): SupabaseQuery<T> => {
  const [result, setResult] = useState<SupabaseQuery<T>>({
    loading: false,
    data: null,
    error: null
  })

  useEffect(() => {
    let ignore = false
    const controller = new AbortController()

    const query = postgrestBuilder ? postgrestBuilder() : null
    if (!query) {
      return
    }

    const fetchData = async () => {
      setResult(prev => ({...prev, loading: true}))

      try {
        const res = query.abortSignal
          ? await query.abortSignal(controller.signal)
          : await query

        if (ignore) {
          return
        }

        setResult({
          loading: false,
          data: res.error ? null : (res.data as T),
          error: res.error || null
        })
      } catch (e: unknown) {
        if (ignore || (e instanceof Error && e.name === 'AbortError')) {
          return
        }

        setResult({
          loading: false,
          data: null,
          error: e as PostgrestError
        })
      }
    }

    void fetchData()

    return () => {
      ignore = true
      controller.abort()
    }
  }, deps)

  return result
}
