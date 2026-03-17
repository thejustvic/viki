import {HTMLProps, PropsWithChildren, ReactNode} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

interface PropsDrawer extends Props {
  id: string
  open: boolean
  mobile?: boolean
  end?: boolean
  contentClassName?: HTMLProps<HTMLElement>['className']
  side: ReactNode
  sideClassName?: HTMLProps<HTMLElement>['className']
  onClickOverlay?: () => void
}

export const Drawer = ({
  id,
  open,
  mobile,
  end,
  contentClassName = '',
  side,
  sideClassName = '',
  onClickOverlay,
  children,
  className,
  ...props
}: PropsDrawer) => {
  const clickOverlay = () => {
    if (mobile && onClickOverlay) {
      onClickOverlay()
    }
  }

  return (
    <div
      className={twMerge(
        'drawer',
        className,
        end && 'drawer-end',
        open && !mobile && 'drawer-open'
      )}
      {...props}
    >
      <input
        id={id}
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        readOnly
      />
      <div className={twMerge('drawer-content', contentClassName)}>
        <label htmlFor={id} aria-label="open sidebar"></label>
        {children}
      </div>
      <div className={twMerge('drawer-side', sideClassName)}>
        <label
          htmlFor={id}
          aria-label="close sidebar"
          className={twMerge(mobile && 'drawer-overlay')}
          onClick={clickOverlay}
        ></label>
        {side}
      </div>
    </div>
  )
}
