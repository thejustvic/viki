type ByKey<T> = keyof T
// @ts-expect-error:  Type 'T[keyof T]' is not assignable to type 'string | number | symbol'
type Accumulator<T> = {[key in T[ByKey<T>]]?: T}

export class ArrUtil {
  public static fastGroupBy<T>(arr: T[], by: ByKey<T>): Accumulator<T> {
    return arr.reduce((acc, item) => {
      const byValue = item[by]
      acc[byValue] = item
      return acc
    }, {} as Accumulator<T>)
  }

  public static groupBy<T, K extends keyof T>(
    items: T[],
    by: K
  ): Map<T[K], T[]> {
    return items.reduce((acc: Map<T[K], T[]>, value: T) => {
      const key = value[by]
      acc.set(key, [...(acc.get(key) ?? []), value])
      return acc
    }, new Map())
  }

  public static insert<T>(
    array: ReadonlyArray<T>,
    index: number,
    ...items: T[]
  ): T[] {
    return [...array.slice(0, index), ...items, ...array.slice(index)] as T[]
  }

  public static deleteAtIndex<T>(arr: T[], ix: number): T[] {
    if (ix === -1) {
      return arr
    }
    return [...arr.slice(0, ix), ...arr.slice(ix + 1)]
  }

  public static delete<T>(arr: T[], item: T): T[] {
    return arr.filter(x => x !== item)
  }

  public static move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex) {
      return array
    }
    const [minIndex, maxIndex] =
      fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex]
    const item = array[minIndex]
    return ArrUtil.insert(
      ArrUtil.deleteAtIndex(array, minIndex),
      maxIndex,
      item
    )
  }

  public static swap<T>(
    array: ReadonlyArray<T>,
    index: number,
    item: T
  ): ReadonlyArray<T> {
    return ArrUtil.insert(array, index, item).filter(
      (_: T, i: number) => i !== index + 1
    ) as ReadonlyArray<T>
  }

  public static last<T>(array?: ArrayLike<T>): T | undefined {
    return array?.[array.length - 1]
  }

  public static intersection<T>(x: T[], y: T[]): T[] {
    return x.filter(n => y.includes(n))
  }

  public static areListsEqual<T>(x: T[], y: T[]): boolean {
    return (
      x.length === y.length && x.length === ArrUtil.intersection(x, y).length
    )
  }

  public static areListsNotEqual<T>(x: T[], y: T[]): boolean {
    return !ArrUtil.areListsEqual(x, y)
  }

  public static unique<T, I>(list: T[], index: (t: T) => I): T[] {
    if (!list) {
      return []
    }
    const ids: Set<I> = new Set()
    const res: T[] = []
    list.forEach(t => {
      const ix = index(t)
      if (!ids.has(ix)) {
        ids.add(ix)
        res.push(t)
      }
    })
    return res
  }

  public static union<T>(arr1: T[] | undefined, arr2: T[] | undefined): T[] {
    return [...new Set([...(arr1 ?? []), ...(arr2 ?? [])])]
  }

  public static defined<T>(arr: (T | undefined)[]): T[] {
    return arr.filter(el => typeof el !== 'undefined') as unknown as T[]
  }

  public static diff<T>(
    oldArr: T[],
    newArr: T[]
  ): {
    add: T[]
    remove: T[]
  } {
    const oldSet = new Set(oldArr)
    const newSet = new Set(newArr)
    return {
      add: newArr.filter(x => !oldSet.has(x)),
      remove: oldArr.filter(x => !newSet.has(x))
    }
  }
}
