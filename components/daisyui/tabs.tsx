import {headerHeight} from '@/utils/const'
import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

/* name of each tab group should be unique */
export const Tabs = ({children, className, ...props}: Props) => {
  return (
    <div
      role="tablist"
      className={twJoin('tabs tabs-box', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface PropsTab extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  groupName: string
  checked: boolean
}

Tabs.Tab = ({label, groupName, className, checked, ...props}: PropsTab) => {
  return (
    <input
      type="radio"
      name={groupName}
      checked={checked}
      role="tab"
      className={twJoin('tab h-[42px] my-2', className)}
      aria-label={label}
      style={{height: headerHeight}}
      {...props}
    />
  )
}

Tabs.TabContent = ({children, className, ...props}: Props) => {
  return (
    <div
      className={twJoin(
        'tab-content bg-base-100/50 border-base-300/50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
