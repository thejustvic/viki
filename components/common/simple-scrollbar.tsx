'use client'

import {HTMLProps, ReactNode} from 'react'
import {isMobile, isTablet} from 'react-device-detect'
import SimpleBarReact from 'simplebar-react'

interface Props {
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

export const SimpleScrollbar = ({children, className, style}: Props) => {
  if (isMobile || isTablet) {
    return (
      <div
        style={{overflowY: 'auto', height: '100%', minHeight: 0, ...style}}
        className={className}
      >
        {children}
      </div>
    )
  }
  return (
    <SimpleBarReact
      className={className}
      style={{overflowY: 'auto', height: '100%', minHeight: 0, ...style}}
    >
      {children}
    </SimpleBarReact>
  )
}
