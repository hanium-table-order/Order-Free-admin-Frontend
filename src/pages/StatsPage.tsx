import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const daySales = [
  { day:'월', total:190000 }, { day:'화', total:210000 }, { day:'수', total:260000 },
  { day:'목', total:310000 }, { day:'금', total:360000 }, { day:'토', total:420000 }, { day:'일', total:380000 },
]
const topMenus = [
  { rank:1, name:'김치찌개', qty:23, amount:184000 },
  { rank:2, name:'불고기', qty:18, amount:270000 },
  { rank:3, name:'된장찌개', qty:15, amount:105000 },
  { rank:4, name:'냉면', qty:12, amount:108000 },
  { rank:5, name:'공기밥', qty:45, amount:45000 },
]

export default function StatsPage(){
  const [period, setPeriod] = useState<'오늘'|'이번 주'|'이번 달'|'기간 설정'>('오늘')
  const kpis = useMemo(() => ({ revenue:1250000, count:87, avg:14368, revenueDiff:+12.5, countDiff:-3.2, avgDiff:+8.1 }), [period])

  return (
    <div className="grid grid-2">
      <div className="card" style={{gridColumn:'1/3', display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
        <h3 style={{margin:0}}>매출 통계</h3>
        <div style={{display:'flex', gap:8}}>
          {(['오늘','이번 주','이번 달','기간 설정'] as const).map(p => (
            <button key={p} className={'btn ' + (period===p?'':'ghost')} onClick={()=>setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="muted">총 매출액</div>
        <div className="kpi">₩ {kpis.revenue.toLocaleString()}</div>
        <div className="muted">{kpis.revenueDiff>0?'▲':'▼'} {Math.abs(kpis.revenueDiff)}% 전일 대비</div>
      </div>
      <div className="card">
        <div className="muted">주문 건수</div>
        <div className="kpi">{kpis.count}건</div>
        <div className="muted">{kpis.countDiff>0?'▲':'▼'} {Math.abs(kpis.countDiff)}% 전일 대비</div>
      </div>
      <div className="card">
        <div className="muted">평균 주문액</div>
        <div className="kpi">₩ {kpis.avg.toLocaleString()}</div>
        <div className="muted">{kpis.avgDiff>0?'▲':'▼'} {Math.abs(kpis.avgDiff)}% 전일 대비</div>
      </div>

      <div className="card">
        <h4 style={{margin:'0 0 8px'}}>매출 추이</h4>
        <div style={{width:'100%', height:260}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4 style={{margin:'0 0 8px'}}>인기 메뉴 순위</h4>
        <table className="table">
          <thead><tr><th>순위</th><th>메뉴명</th><th>판매량</th><th>매출액</th></tr></thead>
          <tbody>
            {topMenus.map(m => (
              <tr key={m.rank}>
                <td>{m.rank}</td><td>{m.name}</td><td>{m.qty}개</td><td>₩ {m.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
