import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {ReadonlyURLSearchParams} from 'next/navigation'
import {Writable} from 'ts-essentials'

export class Util {
  static noop(..._: unknown[]): void {
    // do nothing
  }

  static clone<T>(obj: T): Writable<T> {
    if (typeof obj !== 'object' || !obj) {
      return obj
    }

    if (Array.isArray(obj)) {
      const newArr = []
      for (let i = 0; i < obj.length; i += 1) {
        newArr[i] = this.clone(obj[i])
      }
      return newArr as unknown as T
    }

    const newObj: any = {}
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        newObj[k] = this.clone(obj[k])
      }
    }
    return newObj
  }

  static sortByDate<T>(arr: WithRequiredCreatedAt<T>[]): T[] {
    return arr.sort((a, b) => {
      return new Date(a.created_at) > new Date(b.created_at) ? 1 : -1
    })
  }

  static deleteQueryParam(
    readonlyURLSearchParams: ReadonlyURLSearchParams,
    queryName: string
  ): URLSearchParams {
    const params = new URLSearchParams(readonlyURLSearchParams)
    params.delete(queryName)
    return params
  }

  static addQueryParam(
    readonlyURLSearchParams: ReadonlyURLSearchParams,
    queryName: string,
    value: string
  ): URLSearchParams {
    const params = new URLSearchParams(readonlyURLSearchParams)
    params.set(queryName, value)
    return params
  }

  static routerPushQuery(
    router: AppRouterInstance,
    queryString: URLSearchParams,
    pathname: string
  ): void {
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }
}

type WithRequiredCreatedAt<T> = T & {
  created_at: string
}
