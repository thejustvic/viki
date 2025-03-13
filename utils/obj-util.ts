import {Util} from './util'

export class ObjUtil {
  public static isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  public static keys<T>(obj: T): Array<Extract<keyof T, string>> {
    if (!obj) {
      return []
    }
    return Object.keys(obj) as Array<Extract<keyof T, string>>
  }

  public static update<T, K extends keyof T>(
    obj: T,
    key: K,
    cb: (item: T[K] | undefined) => unknown
  ): T {
    const value = obj[key]
    const newValue = cb(value)
    return {...obj, [key]: newValue}
  }

  public static values<T>(obj: T): Array<T[keyof T]> {
    if (!obj) {
      return []
    }
    return Object.keys(obj).map((key: string) => {
      const k = key as keyof T
      return obj[k]
    })
  }

  public static entries<T>(obj: T): Array<[keyof T, T[keyof T]]> {
    if (!obj) {
      return []
    }
    return Object.keys(obj).map((key: string) => {
      const k = key as keyof T
      return [k, obj[k]] as [keyof T, T[keyof T]]
    })
  }

  public static list<T, U>(obj: T, fn: (k: keyof T, v: T[keyof T]) => U): U[] {
    if (!obj) {
      return []
    }
    return Object.keys(obj).map(key => {
      const k = key as keyof T
      return fn(k, obj[k])
    })
  }

  public static map<T, U>(
    obj: T,
    mapper: (k: keyof T, v: T[keyof T]) => U
  ): {[key in keyof T]: U} {
    if (!obj || !mapper) {
      console.error(`Incorrect mapping arguments`)
      return undefined as never
    }
    const res: {[key in keyof T]: U} = {} as {[key in keyof T]: U}
    Object.keys(obj).forEach(key => {
      const k = key as keyof T
      res[k] = mapper(k, obj[k])
    })
    return res
  }

  public static forEach<T>(
    obj: T,
    fn: (k: keyof T, v: T[keyof T]) => void
  ): void {
    if (!obj) {
      return
    }
    Object.keys(obj).forEach(key => {
      const k = key as Extract<keyof T, string>
      fn(k, obj[k])
    })
  }

  public static isEmpty(obj: unknown): boolean {
    if (!obj?.hasOwnProperty) {
      return true
    }
    for (const k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) {
        continue
      }
      return false
    }
    return true
  }

  public static getAddedKeys<T>(o1: T, o2: T): Set<keyof T> {
    return this.getDeletedKeys(o2, o1)
  }

  public static getDeletedKeys<T>(o1: T, o2: T): Set<keyof T> {
    const obj1: Partial<T> = o1 || {}
    const obj2: Partial<T> = o2 || {}
    const res: Set<keyof T> = new Set()

    ObjUtil.forEach(obj1, k => {
      if (
        obj1[k] !== null &&
        obj1[k] !== undefined &&
        (!(k in obj2) || obj2[k] === null || obj2[k] === undefined)
      ) {
        res.add(k)
      }
    })
    return res
  }

  public static omit<T, K extends keyof T>(
    obj: T,
    ...keys: K[]
  ): Omit<T, (typeof keys)[number]> {
    if (!obj) {
      return obj
    }
    const newObj = Util.clone(obj)
    for (const key of keys) {
      delete newObj[key]
    }

    return newObj
  }

  public static filter<T extends Record<string, unknown>>(
    obj: T,
    filter: (k: keyof T, v: T[keyof T]) => boolean
  ): Partial<T> {
    if (!obj) {
      return {}
    }
    const res: Partial<T> = {}
    ObjUtil.forEach(obj, (k, v) => {
      if (filter(k, v)) {
        res[k] = v
      }
    })
    return res
  }
}
