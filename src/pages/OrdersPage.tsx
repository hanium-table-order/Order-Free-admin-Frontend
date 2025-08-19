import { useState } from 'react'
import { useOrders } from '../hooks/useOrders'
import type { Order } from '../types'
import ManualOrderModal from '../components/ManualOrderModal'

// 상태별 컬럼 메타 (글자/배경 틴트는 index.css의 변수 사용)
const STATUS_META: Record<Order['status'], { label: string; tint: string }> = {
  신규:   { label: '신규 주문',   tint: 'var(--tint-new)'  },
  준비중: { label: '준비 중',     tint: 'var(--tint-prep)' },
  완료:   { label: '완료/전달',   tint: 'var(--tint-done)' },
}

export default function OrdersPage() {
  const {
    grouped, setStatus,
    soundOn, setSoundOn,
    autoAccept, setAutoAccept,
    addManualOrder,
  } = useOrders()

  const [openManual, setOpenManual] = useState(false)

  return (
    <>
      {/* 상단 컨트롤 바 */}
      <div className="controls">
        <div className="kv">
          <span>알림음</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={soundOn}
              onChange={(e) => setSoundOn(e.target.checked)}
            />
            <span className="slider" />
          </label>

          <button className="chip" onClick={() => setAutoAccept(v => !v)}>
            {autoAccept ? '자동 접수: 켬' : '자동 접수: 끔'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button className="btn ghost" onClick={() => window.location.reload()}>
            새로고침
          </button>
          <button className="btn primary" onClick={() => setOpenManual(true)}>
            수동 주문
          </button>
        </div>
      </div>

      {/* 3컬럼 보드 */}
      <div className="grid grid-3">
        <Column
          title={STATUS_META['신규'].label}
          tint={STATUS_META['신규'].tint}
          orders={grouped['신규']}
          renderActions={(o) => (
            <button className="btn primary" onClick={() => setStatus(o.id, '준비중')}>
              주문 접수
            </button>
          )}
        />
        <Column
          title={STATUS_META['준비중'].label}
          tint={STATUS_META['준비중'].tint}
          orders={grouped['준비중']}
          renderActions={(o) => (
            <button className="btn ghost" onClick={() => setStatus(o.id, '완료')}>
              준비 완료
            </button>
          )}
        />
        <Column
          title={STATUS_META['완료'].label}
          tint={STATUS_META['완료'].tint}
          orders={grouped['완료']}
          renderActions={() => null}
        />
      </div>

      {/* 수동 주문 모달 */}
      <ManualOrderModal
        open={openManual}
        onClose={() => setOpenManual(false)}
        onSubmit={(tableId, items) => addManualOrder(tableId, items)}
      />
    </>
  )
}

function Column({
  title, tint, orders, renderActions,
}: {
  title: string
  tint: string
  orders: Order[]
  renderActions: (o: Order) => React.ReactNode
}) {
  return (
    <section className="card">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{title}</h3>
        <span
          style={{
            background: 'var(--brand)',
            color: '#fff',
            padding: '2px 10px',
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {orders.length}
        </span>
      </header>

      <div style={{ display: 'grid', gap: 16 }}>
        {orders.map((o) => (
          <article
            key={o.id}
            className="card"
            style={{
              background: tint,
              border: '1px solid rgba(0,0,0,.04)',
              boxShadow: '0 1px 4px rgba(0,0,0,.06)', // 플랫에 가까운 아주 약한 음영
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{o.tableName}</div>
              <div style={{ color: 'var(--sub)' }}>{o.minutesAgo ?? 0}분 전</div>
            </div>

            <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
              {o.items.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ color: '#222' }}>
                    {it.name} <span style={{ color: '#a1a1a1', margin: '0 4px' }}>·</span> {it.qty}개
                  </div>
                  <div style={{ color: '#111', fontWeight: 800 }}>
                    {it.price.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 15, color: '#111' }}>
              총액 <strong style={{ fontWeight: 800 }}>{o.total.toLocaleString()}원</strong>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              {renderActions(o)}
            </div>
          </article>
        ))}

        {!orders.length && (
          <div
            style={{
              border: '1px dashed var(--line)',
              borderRadius: 16,
              padding: 20,
              textAlign: 'center',
              background: '#fff',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>표시할 주문이 없습니다</div>
            <div style={{ color: 'var(--sub)' }}>새 주문이 들어오면 이곳에 표시됩니다.</div>
          </div>
        )}
      </div>
    </section>
  )
}
