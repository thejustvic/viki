'use client'

import {HTMLProps, ReactNode} from 'react'
import SimpleBarReact from 'simplebar-react'

interface Props {
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

export const SimpleScrollbar = ({children, className, style}: Props) => {
  return (
    <SimpleBarReact
      className={className}
      style={{overflowY: 'auto', height: '100%', minHeight: 0, ...style}}
    >
      {children}
    </SimpleBarReact>
  )
}
