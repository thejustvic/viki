import {HTMLProps, ReactNode} from 'react'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

interface Props {
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
  containerRef?: (ref: HTMLElement) => void
}

export const PerfectScrollbar = ({
  children,
  className,
  style,
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
      style={style}
      containerRef={ref => {
        containerRef?.(ref)
      }}
    >
      {children}
    </ReactPerfectScrollbar>
  )
}
