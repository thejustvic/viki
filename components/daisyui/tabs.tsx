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
      className={twJoin('tabs tabs-lift', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface PropsTab extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  groupName: string
  active: boolean
}

Tabs.Tab = ({label, groupName, className, active, ...props}: PropsTab) => {
  return (
    <input
      type="radio"
      name={groupName}
      role="tab"
      className={twJoin('tab', className, active && 'tab-active')}
      aria-label={label}
      {...props}
    />
  )
}

Tabs.TabContent = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('tab-content', className)} {...props}>
      {children}
    </div>
  )
}
