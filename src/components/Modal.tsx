import React, { useEffect, useRef } from 'react'

type ModalProps = {
  open: boolean
  title?: string
  maxWidth?: number
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, title, maxWidth = 720, onClose, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // ESC로 닫기
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={onBackdropClick}>
      <div
        className="modal-panel"
        ref={panelRef}
        style={{ width: 'min(100%, '+maxWidth+'px)' }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose} aria-label="닫기">×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}
