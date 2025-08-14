import React, { useEffect, useRef, useState } from 'react'

type Item = { label: string; onClick: () => void }
type Props = { items: Item[] }

export default function PopoverMenu({ items }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="popover" ref={ref}>
      <button className="btn ghost" onClick={() => setOpen(o => !o)} aria-haspopup="menu">⋯</button>
      {open && (
        <div className="popover-menu" role="menu">
          {items.map((it, i) => (
            <button key={i} className="popover-item" onClick={() => { it.onClick(); setOpen(false) }}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
