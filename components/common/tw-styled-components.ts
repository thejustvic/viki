import React, {
  ComponentPropsWithoutRef,
  ComponentRef,
  ElementType,
  forwardRef,
  JSX
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
      // calculate the classes by passing all the props in interpolation
      const computedParts = interpolations.map(i => {
        const val =
          typeof i === 'function'
            ? i(props as ComponentPropsWithoutRef<T> & P)
            : i
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return val || '' // prevents the appearance of "null", "undefined", "false" strings
      })

      const fullRawString = String.raw({raw: strings}, ...computedParts)

      // remove extra spaces and hyphens
      const sanitizedClasses = fullRawString.replace(/\s+/g, ' ').trim()

      // filter props starting with $ (Transient Props)
      const cleanProps = {} as Record<string, unknown>
      Object.keys(props).forEach(key => {
        if (!key.startsWith('$')) {
          cleanProps[key] = (props as Record<string, unknown>)[key]
        }
      })

      return React.createElement(Tag, {
        ...cleanProps,
        ref,
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        className: twMerge(sanitizedClasses, className || '') // use || '' so that twMerge doesn't get undefined
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
