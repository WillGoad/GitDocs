import React, { PropsWithChildren, forwardRef } from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from '@emotion/css'

interface ButtonProps {
  className?: string
  active: boolean
  reversed?: boolean
  onMouseDown: (event: any) => void
}


export const Button = forwardRef<HTMLSpanElement, PropsWithChildren<ButtonProps>>(
  (
    {
      className,
      active,
      reversed,
      ...props
    },
    ref
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
              ? 'black'
              : '#ccc'};
        `
      )}
    />
  )
)

interface EditorValueProps {
  className?: string
  value?: any
}

export const EditorValue = forwardRef<HTMLDivElement, EditorValueProps>(
  (
    {
      className,
      value,
      ...props
    }: EditorValueProps,
    ref
  ) => {
    const textLines = value.document.nodes
      .map((node: any) => node.text)
      .toArray()
      .join('\n')
    return (
      <div
        ref={ref}
        {...props}
        className={cx(
          className,
          css`
            margin: 30px -20px 0;
          `
        )}
      >
        <div
          className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
        >
          Slate's value as text
        </div>
        <div
          className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
        >
          {textLines}
        </div>
      </div>
    )
  }
)

interface IconProps {
  className?: string
  
}

export const Icon: Function = forwardRef<HTMLSpanElement, IconProps>(
  (
    { className,  ...props }: IconProps,
    ref
  ) => (
    <span
      {...props}
      ref={ref}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    />
  )
)

interface InstructionProps {
  className?: string
}

export const Instruction = forwardRef<HTMLDivElement, InstructionProps>(
  (
    { className, ...props }: InstructionProps,
    ref
  ) => (
    <div
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `
      )}
    />
  )
)

interface MenuProps {
  className?: string
}

export const Menu = forwardRef<HTMLDivElement, PropsWithChildren<MenuProps>>(
  (
    { className, ...props }: MenuProps,
    ref
  ) => (
    <div
      {...props}
      data-test-id="menu"
      ref={ref}
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }
          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
)

interface PortalProps {
  children: React.ReactNode
}

export const Portal = ({ children }: PortalProps) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

interface ToolbarProps {
  className?: string
}

export const Toolbar = forwardRef<HTMLDivElement, PropsWithChildren<ToolbarProps>>(
  (
    { className, ...props }: ToolbarProps,
    ref
  ) => (
    <Menu
      {...props}
      ref={ref}
      className={cx(
        className,
        css`
          position: relative;
          padding: 18px;
          margin: 0 0px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
          display: flex;
          align-items:center;
          justify-content: center;
          line-height: 10px;
        `
      )}
    />
  )
)