import { useEffect, useMemo, useState } from 'react'
import type { Order, OrderItem, OrderStatus } from '../types'
import { initialOrders, menuItems, tables } from '../mockData'

/**
 * 주문 상태/이벤트를 관리하는 훅
 * - 현재는 목업 데이터 기반
 * - autoAccept가 켜져 있으면 신규 생성 주문은 '준비중'으로 들어감
 * - soundOn이 켜져 있으면 신규 주문 생성 시 비프음 재생
 * - 매 1분마다 minutesAgo 증가
 * - 수동 주문(addManualOrder) 및 상태 변경(setStatus) 제공
 * ──────────────────────────────────────────────────────────
 * ⚙️ 실서버 전환 시:
 *   - 이 파일에서 fetch/SSE/WebSocket 로직만 교체하면 나머지 UI는 그대로 동작
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [soundOn, setSoundOn] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)

  // 12초마다 임의의 신규 주문 생성(목업)
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

      if (soundOn) {
        new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
          .play()
          .catch(() => {}) // 사용자 상호작용 이전 재생 차단될 수 있음 → 무시
      }
    }, 12000)

    return () => clearInterval(t)
  }, [soundOn, autoAccept])

  // 분 경과 증가(표시용)
  useEffect(() => {
    const t = setInterval(
      () => setOrders(o => o.map(x => ({ ...x, minutesAgo: (x.minutesAgo ?? 0) + 1 }))),
      60000
    )
    return () => clearInterval(t)
  }, [])

  // 주문 상태 변경
  const setStatus = (id: string, status: OrderStatus) =>
    setOrders(o => o.map(x => (x.id === id ? { ...x, status } : x)))

  // 수동 주문 추가(테이블/아이템 선택)
  const addManualOrder = (tableId: number, items: OrderItem[]) => {
    if (!items.length) return
    const id = Math.random().toString(36).slice(2, 8)
    const tableName = tables.find(t => t.id === tableId)?.name ?? `${tableId}번 테이블`
    const merged = mergeSameNames(items)
    const total = merged.reduce((s, it) => s + it.price, 0)

    const newOrder: Order = {
      id,
      tableId,
      tableName,
      status: autoAccept ? '준비중' : '신규', // 정책: 자동접수 켜져있으면 '준비중'
      minutesAgo: 0,
      items: merged,
      total,
    }
    setOrders(o => [newOrder, ...o])

    if (soundOn && !autoAccept) {
      // 수동 주문이더라도 '신규'로 들어갈 때만 알림음
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {})
    }
  }

  // 같은 메뉴 이름을 합쳐 수량/금액 누적
  function mergeSameNames(items: OrderItem[]): OrderItem[] {
    const map = new Map<string, OrderItem>()
    for (const it of items) {
      const cur = map.get(it.name)
      if (!cur) map.set(it.name, { ...it })
      else map.set(it.name, { name: it.name, qty: cur.qty + it.qty, price: cur.price + it.price })
    }
    return Array.from(map.values())
  }

  // 상태별 그룹
  const grouped = useMemo(
    () => ({
      신규: orders.filter(o => o.status === '신규'),
      준비중: orders.filter(o => o.status === '준비중'),
      완료: orders.filter(o => o.status === '완료'),
    }),
    [orders]
  )

  return {
    orders,
    grouped,
    setStatus,
    soundOn,
    setSoundOn,
    autoAccept,
    setAutoAccept,
    addManualOrder,
  }
}
