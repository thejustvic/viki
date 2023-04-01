import {createContext, useContext} from 'react'

type InferState<Store> = Store extends {state: unknown}
  ? Store['state']
  : unknown

export const createUseStore = <
  T extends {state: unknown} | undefined
>(): readonly [typeof Context, () => readonly [InferState<T>, T]] => {
  const Context = createContext(undefined as T)
  const useStore = (): readonly [InferState<T>, T] => {
    const store = useContext(Context)
    return [store?.state as InferState<T>, store] as const
  }
  return [Context, useStore] as const
}
