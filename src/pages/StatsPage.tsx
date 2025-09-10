import { useMemo, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ----------------------- Mock Data ----------------------- */
const daySales = [
  { day: '월', total: 190000 },
  { day: '화', total: 210000 },
  { day: '수', total: 260000 },
  { day: '목', total: 310000 },
  { day: '금', total: 360000 },
  { day: '토', total: 420000 },
  { day: '일', total: 380000 },
]

const topMenus = [
  { rank: 1, name: '김치찌개', qty: 23, amount: 184000 },
  { rank: 2, name: '불고기',   qty: 18, amount: 270000 },
  { rank: 3, name: '된장찌개', qty: 15, amount: 105000 },
  { rank: 4, name: '냉면',     qty: 12, amount: 108000 },
  { rank: 5, name: '공기밥',   qty: 45, amount: 45000  },
]

const hourlyOrders = [
  { time: '09:00', cnt: 2 }, { time: '10:00', cnt: 5 }, { time: '11:00', cnt: 8 },
  { time: '12:00', cnt: 15 }, { time: '13:00', cnt: 12 }, { time: '14:00', cnt: 6 },
  { time: '15:00', cnt: 3 },  { time: '16:00', cnt: 4 }, { time: '17:00', cnt: 7 },
  { time: '18:00', cnt: 11 }, { time: '19:00', cnt: 14 }, { time: '20:00', cnt: 9 },
]

/* ----------------------- Utils ----------------------- */
const won = (n: number) => `₩ ${n.toLocaleString()}`

/* ----------------------- Custom Tooltips (any로 안전하게) ----------------------- */
function MoneyTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const v = Number(payload[0]?.value ?? 0)
  return <div className="chart-tip">₩ {v.toLocaleString()}</div>
}

function CountTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null
  const v = Number(payload[0]?.value ?? 0)
  return <div className="chart-tip">{v.toLocaleString()}건</div>
}

/* ----------------------- Page ----------------------- */
export default function StatsPage() {
  const [period, setPeriod] =
    useState<'오늘' | '이번 주' | '이번 달' | '기간 설정'>('오늘')

  const kpis = useMemo(() => {
    switch (period) {
      case '이번 주':   return { revenue: 6_930_000,  count: 521,  avg: 13298, revenueDiff: +6.1,  countDiff: +4.2,  avgDiff: +1.8 }
      case '이번 달':   return { revenue: 27_340_000, count: 1998, avg: 13680, revenueDiff: +12.9, countDiff: +9.4,  avgDiff: +2.2 }
      case '기간 설정': return { revenue: 12_500_000, count: 860,  avg: 14580, revenueDiff: -1.2,  countDiff: -0.8,  avgDiff: +0.5 }
      default:          return { revenue: 1_250_000,  count: 87,   avg: 14368, revenueDiff: +12.5, countDiff: -3.2, avgDiff: +8.1 }
    }
  }, [period])

  return (
    <div className="page page-stats">
      <div className="container" style={{ paddingTop: 18 }}>
        {/* Header */}
        <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div style={{ fontSize:20, fontWeight:800 }}>매출 통계</div>
          <div style={{ display:'flex', gap:8 }}>
            {(['오늘','이번 주','이번 달','기간 설정'] as const).map(p => (
              <button
                key={p}
                className={'btn ' + (period===p ? '' : 'ghost')}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16, marginTop: 16 }}>
          <div className="card kpi-card">
            <div className="kpi-label">총 매출액</div>
            <div className="kpi-value">₩ {kpis.revenue.toLocaleString()}</div>
            <div className={`kpi-diff ${kpis.revenueDiff >= 0 ? 'up' : 'down'}`}>
              전일 대비 {kpis.revenueDiff >= 0 ? '▲' : '▼'} {Math.abs(kpis.revenueDiff)}%
            </div>
          </div>

          <div className="card kpi-card">
            <div className="kpi-label">주문 건수</div>
            <div className="kpi-value">{kpis.count.toLocaleString()}건</div>
            <div className={`kpi-diff ${kpis.countDiff >= 0 ? 'up' : 'down'}`}>
              전일 대비 {kpis.countDiff >= 0 ? '▲' : '▼'} {Math.abs(kpis.countDiff)}%
            </div>
          </div>

          <div className="card kpi-card">
            <div className="kpi-label">평균 주문액</div>
            <div className="kpi-value">₩ {kpis.avg.toLocaleString()}</div>
            <div className={`kpi-diff ${kpis.avgDiff >= 0 ? 'up' : 'down'}`}>
              전일 대비 {kpis.avgDiff >= 0 ? '▲' : '▼'} {Math.abs(kpis.avgDiff)}%
            </div>
          </div>
        </div>

        {/* Charts + Top List */}
        <div className="grid" style={{ gridTemplateColumns:'1.1fr 0.9fr', gap:12, marginTop:12 }}>
          {/* Bar */}
          <div className="card">
            <div className="stats-section-title">매출 추이</div>
            <div className="muted" style={{ margin:'2px 0 8px' }}>최근 7일간 일별 매출 현황</div>
            <div style={{ width:'100%', height:300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daySales} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(v) => (v/10000)+'만'} />
                  {/* 회색 배경/하이라이트 제거 + 금액만 */}
                  <Tooltip cursor={false} content={<MoneyTooltip />} />
                  <Bar dataKey="total" radius={[8,8,0,0]} fill="var(--brand)" activeBar={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top menus — card list */}
          <div className="card">
            <div className="stats-section-title">인기 메뉴 순위</div>
            <ul className="top-list">
              {topMenus.map((m) => (
                <li key={m.rank} className="top-item">
                  <div className={'rank-chip ' + (m.rank<=3 ? 'hit':'')}>
                    {m.rank}
                  </div>

                  <div className="item-main">
                    <div className="item-name" title={m.name}>{m.name}</div>
                    <div className="item-sub">
                      <span className="pill">{m.qty.toLocaleString()}개</span>
                    </div>
                  </div>

                  <div className="item-amount">{won(m.amount)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Line */}
        <div className="card" style={{ marginTop:12 }}>
          <div className="stats-section-title">시간대별 주문 패턴</div>
          <div className="muted" style={{ margin:'2px 0 8px' }}>오늘 시간대별 주문 건수 추이</div>
          <div style={{ width:'100%', height:260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={false} content={<CountTooltip />} />
                <Line
                  type="monotone"
                  dataKey="cnt"
                  stroke="var(--brand)"
                  strokeWidth={3}
                  dot={{ r:4 }}
                  activeDot={{ r:6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
