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
  onDoubleClick?: MouseEventHandler<HTMLDivElement>
  onMouseDown?: MouseEventHandler<HTMLDivElement>
  onMouseUp?: MouseEventHandler<HTMLDivElement>
  onMouseEnter?: MouseEventHandler<HTMLDivElement>
  onMouseLeave?: MouseEventHandler<HTMLDivElement>
  onTouchStart?: TouchEventHandler<HTMLDivElement>
  onTouchEnd?: TouchEventHandler<HTMLDivElement>
  onTouchMove?: TouchEventHandler<HTMLDivElement>
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
        'chat-bubble touch-manipulation px-2 pb-4',
        className,
        color === 'primary' && 'bg-base-300/50',
        color === 'secondary' && 'bg-base-200'
      )}
      {...props}
    >
      {children}
    </div>
  )
}
