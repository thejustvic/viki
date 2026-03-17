import React, {
  ComponentPropsWithoutRef,
  ComponentRef,
  createElement,
  ElementType,
  forwardRef,
  JSX,
  useMemo
} from 'react'
import {ClassNameValue, twMerge} from 'tailwind-merge'

// type for functions inside backticks
type Interpolation<P> = (props: P) => ClassNameValue

// basic type of component factory
type TwTemplate<T extends ElementType> = <P extends object = object>(
  strings: TemplateStringsArray,
  ...interpolations: (
    | ClassNameValue
    | Interpolation<ComponentPropsWithoutRef<T> & P>
  )[]
) => React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ComponentPropsWithoutRef<T> & P> &
    React.RefAttributes<ComponentRef<T>>
>

const createTwComponent = <T extends ElementType>(Tag: T): TwTemplate<T> => {
  return <P extends object = object>(
    strings: TemplateStringsArray,
    ...interpolations: (
      | ClassNameValue
      | Interpolation<ComponentPropsWithoutRef<T> & P>
    )[]
  ) => {
    const Component = forwardRef<
      ComponentRef<T>,
      ComponentPropsWithoutRef<T> & P
    >(({className, ...props}, ref) => {
      const finalClasses = useMemo(() => {
        const computedParts = interpolations.map(i => {
          const val =
            typeof i === 'function'
              ? i(props as ComponentPropsWithoutRef<T> & P)
              : i
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          return val || '' // prevents the appearance of "null", "undefined", "false" strings
        })

        const fullRawString = String.raw({raw: strings}, ...computedParts)

        const sanitized = fullRawString.replace(/\s+/g, ' ').trim()

        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return twMerge(sanitized, className || '') // use || '' so that twMerge doesn't get undefined
      }, [props, className])

      // filter props starting with $ (Transient Props)
      const cleanProps = useMemo(() => {
        const res = {} as Record<string, unknown>
        for (const key in props) {
          if (!key.startsWith('$')) {
            res[key] = (props as Record<string, unknown>)[key]
          }
        }
        return res as ComponentPropsWithoutRef<T>
      }, [props])

      return createElement(Tag, {
        ...cleanProps,
        ref,
        className: finalClasses
      })
    })

    Component.displayName = `tw(${typeof Tag === 'string' ? Tag : 'Component'})`

    return Component as unknown as ReturnType<TwTemplate<T>>
  }
}

// Proxy to support tw.div, tw.button, etc.
const tw = new Proxy(createTwComponent, {
  get: <K extends keyof JSX.IntrinsicElements>(
    target: (tag: ElementType) => TwTemplate<ElementType>,
    prop: K
  ) => target(prop)
}) as {
  [K in keyof JSX.IntrinsicElements]: TwTemplate<K>
} & {
  <T extends ElementType>(Tag: T): TwTemplate<T>
}

export default tw
