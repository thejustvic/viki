import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

interface Props {
  children: ReactNode
  className?: string
  containerRef?: (ref: HTMLElement) => void
}

export const PerfectScrollbar = ({
  children,
  className,
  containerRef
}: Props) => {
  if (isMobile) {
    return <>{children}</>
  }
  return (
    <ReactPerfectScrollbar
      options={{
        wheelPropagation: false,
        minScrollbarLength: 30
      }}
      className={className}
      containerRef={ref => {
        containerRef?.(ref)
      }}
    >
      {children}
    </ReactPerfectScrollbar>
  )
}
