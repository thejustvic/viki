import {IconCircleX} from '@tabler/icons-react'
import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'
import {Button} from './button'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
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
        className={twJoin('modal', className, open && 'modal-open')}
      >
        <div className="modal-box">
          {children}
          <div className="modal-action">
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
      size="sm"
      shape="circle"
      className="absolute right-2 top-2"
      color="ghost"
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

Modal.Body = ({children, ...props}: PropsBox) => {
  return <div {...props}>{children}</div>
}
