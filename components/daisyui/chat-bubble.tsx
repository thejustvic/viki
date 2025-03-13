import {
  HTMLProps,
  MouseEventHandler,
  PropsWithChildren,
  TouchEventHandler
} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

interface PropsChatBubble extends Props {
  end?: boolean
}

export const ChatBubble = ({
  end,
  className,
  children,
  ...props
}: PropsChatBubble) => {
  return (
    <div
      className={twJoin('chat', className, end ? 'chat-end' : 'chat-start')}
      {...props}
    >
      {children}
    </div>
  )
}

interface PropsChatBubbleMessage extends Props {
  color?: 'primary' | 'secondary'
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
  onDoubleClick?: MouseEventHandler<HTMLDivElement>
  onTouchStart?: TouchEventHandler<HTMLDivElement>
}

ChatBubble.Message = ({
  color,
  className,
  children,
  ...props
}: PropsChatBubbleMessage) => {
  return (
    <div
      className={twJoin(
        'chat-bubble touch-manipulation',
        className,
        color === 'primary' && 'chat-bubble-primary',
        color === 'secondary' && 'chat-bubble-secondary'
      )}
      {...props}
    >
      {children}
    </div>
  )
}
