import {useSearchParams} from 'next/navigation'
import {Writable} from 'ts-essentials'

export class Util {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  static getSearchParam(value: string): string | null {
    return useSearchParams().get(value)
  }
}

type WithRequiredCreatedAt<T> = T & {
  created_at: string
}
