import {useClickOutside} from '@/hooks/use-cilck-outside'
import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
  onClick?: HTMLProps<HTMLElement>['onClick']
  tabIndex?: number | undefined
}

type Placement =
  | 'start'
  | 'center'
  | 'end'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

interface PropsDropdown extends Props {
  hover?: boolean
  placements?: Placement[]
  onClickOutside?: () => void
}

export const Dropdown = ({
  onClickOutside,
  hover,
  placements,
  children,
  className,
  ...props
}: PropsDropdown) => {
  const dropdownRef = useClickOutside(onClickOutside)
  return (
    <div
      ref={dropdownRef}
      className={twJoin(
        'dropdown',
        className,
        hover && 'dropdown-hover',
        placements?.includes('start') && 'dropdown-start',
        placements?.includes('center') && 'dropdown-center',
        placements?.includes('end') && 'dropdown-end',
        placements?.includes('top') && 'dropdown-top',
        placements?.includes('bottom') && 'dropdown-bottom',
        placements?.includes('left') && 'dropdown-left',
        placements?.includes('right') && 'dropdown-right'
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Dropdown.Menu = ({children, className, ...props}: Props) => {
  return (
    <ul className={twJoin('dropdown-content menu', className)} {...props}>
      {children}
    </ul>
  )
}

Dropdown.Item = ({children, ...props}: Props) => {
  return (
    <li {...props}>
      <a>{children}</a>
    </li>
  )
}
