import { useEffect, useMemo, useState } from 'react'
import type { Order, OrderStatus } from '../types'
import { initialOrders, menuItems } from '../mockData'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [soundOn, setSoundOn] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)

  // 12초마다 임의 주문 생성 (목업)
  useEffect(() => {
    const t = setInterval(() => {
      const any = menuItems[Math.floor(Math.random() * menuItems.length)]
      const id = Math.random().toString(36).slice(2, 8)
      const qty = 1 + Math.floor(Math.random() * 2)
      const newOrder: Order = {
        id,
        tableId: Math.ceil(Math.random() * 5),
        tableName: `${1 + Math.floor(Math.random() * 5)}번 테이블`,
        status: autoAccept ? '준비중' : '신규',
        minutesAgo: 0,
        items: [{ name: any.name, qty, price: any.price * qty }],
        total: any.price * qty,
      }
      setOrders(o => [newOrder, ...o])
      if (soundOn) {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(()=>{})
      }
    }, 12000)
    return () => clearInterval(t)
  }, [soundOn, autoAccept])

  // 분 경과 증가
  useEffect(() => {
    const t = setInterval(() =>
      setOrders(o => o.map(x => ({ ...x, minutesAgo: (x.minutesAgo ?? 0) + 1 }))), 60000)
    return () => clearInterval(t)
  }, [])

  const setStatus = (id: string, status: OrderStatus) =>
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x))

  const grouped = useMemo(() => ({
    신규: orders.filter(o => o.status === '신규'),
    준비중: orders.filter(o => o.status === '준비중'),
    완료: orders.filter(o => o.status === '완료'),
  }), [orders])

  return { orders, grouped, setStatus, soundOn, setSoundOn, autoAccept, setAutoAccept }
}
