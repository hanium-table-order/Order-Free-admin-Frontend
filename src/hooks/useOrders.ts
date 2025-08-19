import { useEffect, useMemo, useState } from 'react'
import type { Order, OrderItem, OrderStatus } from '../types'
import { initialOrders, menuItems, tables } from '../mockData'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [soundOn, setSoundOn] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)

  // 목업: 12초마다 랜덤 주문 생성
  useEffect(() => {
    const t = setInterval(() => {
      const m = menuItems[Math.floor(Math.random() * menuItems.length)]
      const id = Math.random().toString(36).slice(2, 8)
      const qty = 1 + Math.floor(Math.random() * 2)
      const tableId = tables[Math.floor(Math.random() * tables.length)]?.id ?? 1

      const newOrder: Order = {
        id,
        tableId,
        tableName: tables.find(t => t.id === tableId)?.name ?? `${tableId}번 테이블`,
        status: autoAccept ? '준비중' : '신규',
        minutesAgo: 0,
        items: [{ name: m.name, qty, price: m.price * qty }],
        total: m.price * qty,
      }

      setOrders(o => [newOrder, ...o])

      if (soundOn && !autoAccept) {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(()=>{})
      }
    }, 12000)
    return () => clearInterval(t)
  }, [soundOn, autoAccept])

  // 표시용 경과시간
  useEffect(() => {
    const t = setInterval(() =>
      setOrders(o => o.map(x => ({ ...x, minutesAgo: (x.minutesAgo ?? 0) + 1 }))), 60000)
    return () => clearInterval(t)
  }, [])

  const setStatus = (id: string, status: OrderStatus) =>
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))

  const addManualOrder = (tableId: number, items: OrderItem[]) => {
    if (!items.length) return
    const id = Math.random().toString(36).slice(2, 8)
    const tableName = tables.find(t => t.id === tableId)?.name ?? `${tableId}번 테이블`
    const merged = mergeSameNames(items)
    const total = merged.reduce((s, it) => s + it.price, 0)

    const newOrder: Order = {
      id, tableId, tableName,
      status: autoAccept ? '준비중' : '신규',
      minutesAgo: 0,
      items: merged,
      total,
    }
    setOrders(o => [newOrder, ...o])

    if (soundOn && !autoAccept) {
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(()=>{})
    }
  }

  function mergeSameNames(items: OrderItem[]): OrderItem[] {
    const map = new Map<string, OrderItem>()
    for (const it of items) {
      const cur = map.get(it.name)
      if (!cur) map.set(it.name, { ...it })
      else map.set(it.name, { name: it.name, qty: cur.qty + it.qty, price: cur.price + it.price })
    }
    return Array.from(map.values())
  }

  const grouped = useMemo(() => ({
    신규: orders.filter(o => o.status === '신규'),
    준비중: orders.filter(o => o.status === '준비중'),
    완료: orders.filter(o => o.status === '완료'),
  }), [orders])

  return {
    orders, grouped, setStatus,
    soundOn, setSoundOn,
    autoAccept, setAutoAccept,
    addManualOrder,
  }
}
