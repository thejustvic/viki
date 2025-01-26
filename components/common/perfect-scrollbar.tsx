import {ReactNode} from 'react'
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
  return (
    <ReactPerfectScrollbar
      options={{
        wheelPropagation: false,
        minScrollbarLength: 30,
        suppressScrollX: true
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
