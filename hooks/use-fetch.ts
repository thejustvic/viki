import {useEffect, useState} from 'react'

export interface FetchQuery<T> {
  loading: boolean
  data: T | null
  error: Error | null
}

export const useFetch = <T>(
  fetchBuilder: null | (() => Promise<Response>),
  deps: unknown[]
): FetchQuery<T> => {
  const isBuilderExist = typeof fetchBuilder === 'function'
  const [result, setResult] = useState<FetchQuery<T>>({
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
      try {
        const response = await fetchBuilder()
        if (!response.ok) {
          setResult({
            loading: false,
            data: null,
            error: new Error(response.statusText)
          })
        } else {
          const data = (await response.json()) as T
          setResult({
            loading: false,
            data,
            error: null
          })
        }
      } catch (error) {
        setResult({
          loading: false,
          data: null,
          error: error as Error
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
