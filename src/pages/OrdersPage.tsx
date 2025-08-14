import { useOrders } from '../hooks/useOrders'
import type { Order } from '../types'

const statusBg: Record<Order['status'], string> = {
  신규: '#fee2e2',
  준비중: '#fef9c3',
  완료: '#dcfce7',
}

export default function OrdersPage() {
  const { grouped, setStatus, soundOn, setSoundOn, autoAccept, setAutoAccept } = useOrders()

  const Column = ({ title, list }: { title: string; list: Order[] }) => (
    <div className="card" style={{ background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent:'space-between', marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>
          {title} <span className="muted">({list.length})</span>
        </div>
      </div>
      <div className="grid" style={{ gap: 12 }}>
        {list.map(o => (
          <div key={o.id} className="card" style={{ background: statusBg[o.status] }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontWeight:700 }}>{o.tableName}</div>
              <div className="muted">{o.minutesAgo ?? 0}분 전</div>
            </div>

            <div style={{ fontSize:14 }}>
              {o.items.map((it, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
                  <div>{it.name} x {it.qty}</div>
                  <div>{it.price.toLocaleString()}원</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight:700, marginTop:8 }}>총액 {o.total.toLocaleString()}원</div>

            <div style={{ marginTop:10, display:'flex', gap:8 }}>
              {o.status === '신규' && (
                <button className="btn" onClick={() => setStatus(o.id, '준비중')}>주문 접수</button>
              )}
              {o.status === '준비중' && (
                <button className="btn ghost" onClick={() => setStatus(o.id, '완료')}>준비 완료</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="grid grid-3">
      <div style={{ gridColumn:'1/4', display:'flex', gap:12, alignItems:'center', marginBottom:8 }}>
        <div className="muted">알림음</div>
        <label className="switch">
          <input type="checkbox" checked={soundOn} onChange={e=>setSoundOn(e.target.checked)} />
          <span className="slider" />
        </label>
        <div style={{ width:10 }} />
        <button className="btn ghost" onClick={() => setAutoAccept(v=>!v)}>
          {autoAccept ? '자동 접수: 켬' : '자동 접수: 끔'}
        </button>
      </div>

      <Column title="신규 주문" list={grouped['신규']} />
      <Column title="준비 중" list={grouped['준비중']} />
      <Column title="완료/전달" list={grouped['완료']} />
    </div>
  )
}
