import {TablerIcon} from '@tabler/icons-react'
import {ChangeEventHandler, HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface PropsWithClassName extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

/* name of each tab group should be unique */
export const Tabs = ({children, className, ...props}: PropsWithClassName) => {
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

interface PropsTab extends PropsWithClassName {
  label: string
  groupName: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  checked: boolean
  icon?: TablerIcon
}

Tabs.Tab = ({
  label,
  value,
  onChange,
  groupName,
  className,
  checked,
  icon: Icon
}: PropsTab) => {
  return (
    <label className={twJoin('tab h-[42px] my-2', className)}>
      <input
        type="radio"
        name={groupName}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      {label}
      {Icon && <Icon className="ml-2" />}
    </label>
  )
}

Tabs.TabContent = ({children, className, ...props}: PropsWithClassName) => {
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
