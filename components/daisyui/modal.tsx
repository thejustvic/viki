import {IconCircleX} from '@tabler/icons-react'
import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'
import {Button} from './button'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  classNameModalBox?: HTMLProps<HTMLElement>['className']
}

interface PropsModal extends Props {
  id: string
  open: boolean
  backdrop?: boolean
  onClickBackdrop?: () => void
  close?: () => void
}

export const Modal = ({
  id,
  open,
  backdrop,
  onClickBackdrop,
  close,
  className,
  classNameModalBox,
  children
}: PropsModal) => {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div
        id={`dialog-${id}`}
        role="dialog"
        className={twMerge('modal', className)}
      >
        <div className={twMerge('modal-box', classNameModalBox)}>
          {children}
          <div className="modal-action mt-0">
            <label htmlFor={id} onClick={close}>
              <Close />
            </label>
          </div>
        </div>
        {backdrop && (
          <label
            className="modal-backdrop"
            htmlFor={id}
            onClick={onClickBackdrop}
          />
        )}
      </div>
    </>
  )
}

const Close = () => {
  return (
    <Button
      ghost
      size="sm"
      shape="circle"
      className="absolute right-2 top-2 text-info/50"
    >
      <IconCircleX />
    </Button>
  )
}

interface PropsBox extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

Modal.Header = ({children, ...props}: PropsBox) => {
  return <div {...props}>{children}</div>
}

Modal.Body = ({children, className, ...props}: PropsBox) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
