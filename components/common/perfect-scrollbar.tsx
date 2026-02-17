import {HTMLProps, ReactNode} from 'react'
import {isMobile, isTablet} from 'react-device-detect'
import ReactPerfectScrollbar from 'react-perfect-scrollbar'

interface Props {
  children: ReactNode
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
  containerRef?: (ref: HTMLElement) => void
  suppressScrollY?: boolean
}

export const PerfectScrollbar = ({
  children,
  className,
  style,
  containerRef,
  suppressScrollY
}: Props) => {
  if (isMobile || isTablet) {
    return (
      <div
        style={{overflowY: 'auto', height: '100%', ...style}}
        className={className}
      >
        {children}
      </div>
    )
  }
  return (
    <ReactPerfectScrollbar
      options={{
        wheelPropagation: false,
        minScrollbarLength: 30,
        suppressScrollX: true,
        suppressScrollY: suppressScrollY
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
