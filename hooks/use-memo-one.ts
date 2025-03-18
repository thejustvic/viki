import {DependencyList, RefObject, useRef, useState} from 'react'

const useLazyRef = <T>(getInitialValue: () => T): RefObject<T> => {
  const [value] = useState(getInitialValue)
  return useRef(value)
}

const areInputsEqual = (
  newInputs: DependencyList,
  lastInputs: DependencyList
): boolean => {
  if (newInputs.length !== lastInputs.length) {
    return false
  }
  for (let i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false
    }
  }
  return true
}

export const useMemoOne = <T>(factory: () => T, deps: DependencyList): T => {
  const valueRef = useLazyRef(factory)
  const prevDeps = useRef(deps)
  if (!areInputsEqual(prevDeps.current, deps)) {
    valueRef.current = factory()
  }
  prevDeps.current = deps
  return valueRef.current
}
