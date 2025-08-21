import React, { useMemo, useRef, useState } from 'react'
import Modal from './Modal'
import { menuItems, tables } from '../mockData'
import type { OrderItem } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (tableId: number, items: OrderItem[]) => void
}

export default function ManualOrderModal({ open, onClose, onSubmit }: Props) {
  const [tableId, setTableId] = useState<number>(tables[0]?.id ?? 1)
  const [cart, setCart] = useState<OrderItem[]>([])
  const total = useMemo(() => cart.reduce((s, it) => s + it.price, 0), [cart])
  const imgInput = useRef<HTMLInputElement>(null) // 필요시 확장용

  const addItem = (name: string, price: number) =>
    setCart(list => [...list, { name, qty: 1, price }])

  const inc = (idx: number, unit: number, priceEach: number) =>
    setCart(list => list.map((it, i) => i!==idx ? it : { ...it, qty: it.qty + unit, price: it.price + unit*priceEach }))

  const remove = (idx: number) =>
    setCart(list => list.filter((_, i) => i !== idx))

  const submit = () => {
    if (!cart.length) return alert('메뉴를 1개 이상 선택하세요')
    onSubmit(tableId, cart)
    setCart([])
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="수동 주문 접수" maxWidth={860}>
      <div className="manual-order">
        <div>
          <div className="f-label" style={{marginBottom:8}}>테이블 선택</div>
          <div className="radio-grid">
            {tables.map(t => (
              <label key={t.id} className={'radio-pill' + (tableId===t.id?' checked':'')}>
                <input type="radio" name="table" checked={tableId===t.id} onChange={()=>setTableId(t.id)} />
                <span>{t.name}</span>
              </label>
            ))}
          </div>

          <div className="f-label" style={{marginTop:20, marginBottom:8}}>메뉴 선택</div>
          <div className="menu-pick-list">
            {menuItems.map(m => (
              <button key={m.id} className="menu-pick" onClick={()=>addItem(m.name, m.price)}>
                <span>{m.name}</span>
                <span className="muted">{m.price.toLocaleString()}원</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="f-label" style={{marginBottom:8}}>주문 내역</div>
          <div className="cart-box">
            {!cart.length && <div className="muted">선택된 메뉴가 없습니다.</div>}
            {!!cart.length && cart.map((it, i) => {
              const priceEach = Math.round(it.price / it.qty)
              return (
                <div key={i} className="cart-row">
                  <div className="cart-name">{it.name}</div>
                  <div className="cart-qty">
                    <button className="qty-btn" onClick={()=> it.qty===1 ? remove(i) : inc(i, -1, priceEach)}>-</button>
                    <span>{it.qty}</span>
                    <button className="qty-btn" onClick={()=>inc(i, +1, priceEach)}>+</button>
                  </div>
                  <div className="cart-amount">{it.price.toLocaleString()}원</div>
                  <button className="remove-btn" onClick={()=>remove(i)}>×</button>
                </div>
              )
            })}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:12, alignItems:'center'}}>
            <div className="kpi">총액 ₩ {total.toLocaleString()}</div>
            <div style={{display:'flex', gap:8}}>
              <button className="btn ghost" onClick={onClose}>취소</button>
              <button className="btn primary" onClick={submit}>주문 전송</button>
            </div>
          </div>
        </div>
      </div>
      <input ref={imgInput} type="file" hidden />
    </Modal>
  )
}
