import { useRef, useState } from 'react'

type TableRow = {
  id: number
  name: string
  code: string
  x: number
  y: number
}

export default function TablesPage() {
  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, name: '1번 테이블', code: '/order?t=1', x: 80,  y: 80 },
    { id: 2, name: '2번 테이블', code: '/order?t=2', x: 260, y: 80 },
    { id: 3, name: '3번 테이블', code: '/order?t=3', x: 80,  y: 220 },
    { id: 4, name: '창가자리',   code: '/order?t=4', x: 260, y: 220 },
  ])

  const [snap, setSnap] = useState(true)
  const [snapStep] = useState(10)

  const floorRef = useRef<HTMLDivElement>(null)

  // ===== CRUD =====
  const addOne = () => {
    const name = prompt('테이블 이름을 입력하세요', `${rows.length + 1}번 테이블`)
    if (!name) return
    const id = Math.max(0, ...rows.map(r => r.id)) + 1
    const rect = floorRef.current?.getBoundingClientRect()
    const x = rect ? rect.width / 2 - 80 : 140
    const y = rect ? rect.height / 2 - 60 : 140
    setRows(list => [...list, { id, name, code: `/order?t=${id}`, x, y }])
  }

  const addBulk = () => {
    const n = Number(prompt('몇 개를 일괄 추가할까요?', '3') || '0')
    if (!Number.isFinite(n) || n <= 0) return
    const maxId = Math.max(0, ...rows.map(r => r.id))
    const baseX = 40, baseY = 40
    const next: TableRow[] = Array.from({ length: n }, (_, i) => {
      const id = maxId + i + 1
      const col = i % 4
      const row = Math.floor(i / 4)
      return {
        id,
        name: `${id}번 테이블`,
        code: `/order?t=${id}`,
        x: baseX + col * (160 + 24),  // 대략적 간격(가변 폭이므로 여유치)
        y: baseY + row * (110 + 24),
      }
    })
    setRows(list => [...list, ...next])
  }

  const remove = (id: number) => {
    const row = rows.find(r => r.id === id)
    if (!row) return
    if (!confirm(`"${row.name}"을(를) 삭제할까요?`)) return
    setRows(list => list.filter(r => r.id !== id))
  }

  // ===== Drag & Drop =====
  type DragState = {
    id: number
    startX: number
    startY: number
    baseX: number
    baseY: number
    w: number
    h: number
  } | null
  const dragRef = useRef<DragState>(null)

  const clampToFloor = (x: number, y: number, w: number, h: number) => {
    const rect = floorRef.current?.getBoundingClientRect()
    if (!rect) return { x, y }
    const maxX = rect.width - w
    const maxY = rect.height - h
    return { x: Math.max(0, Math.min(maxX, x)), y: Math.max(0, Math.min(maxY, y)) }
  }

  const snapIfNeeded = (x: number, y: number) => {
    if (!snap) return { x, y }
    return {
      x: Math.round(x / snapStep) * snapStep,
      y: Math.round(y / snapStep) * snapStep,
    }
  }

  const onPointerDown = (e: React.PointerEvent, id: number) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const el = e.currentTarget as HTMLElement
    const table = rows.find(r => r.id === id)
    if (!table) return
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      baseX: table.x,
      baseY: table.y,
      w: el.offsetWidth,
      h: el.offsetHeight,
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const { id, startX, startY, baseX, baseY, w, h } = dragRef.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    let nx = baseX + dx, ny = baseY + dy
    ;({ x: nx, y: ny } = clampToFloor(nx, ny, w, h))
    ;({ x: nx, y: ny } = snapIfNeeded(nx, ny))
    setRows(list => list.map(r => (r.id === id ? { ...r, x: nx, y: ny } : r)))
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    dragRef.current = null
  }

  return (
    <div className="page page-tables">
      <div className="container">

        {/* 상단 툴바 */}
        <div className="toolbar-right">
          <label className="kv" style={{ gap: 8}}>
            <input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} />
            스냅 정렬
          </label>
          <button className="btn ghost" onClick={addBulk}>일괄 추가</button>
          <button className="btn primary" onClick={addOne}>+ 테이블 추가</button>
        </div>

        {/* 리스트 카드 */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 className="section-title">등록된 테이블 목록</h3>
          <table className="table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>테이블 번호/이름</th>
                <th>QR</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ textAlign: 'left' }}>{r.name}</td>
                  <td><span className="badge gray">QR 코드 인쇄하기</span></td>
                  <td>
                    <button className="btn danger" onClick={() => remove(r.id)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 배치 에디터 */}
        <h3 className="section-title" style={{ marginTop: 0 }}>매장 배치(드래그 앤 드랍)</h3>
        <div
          className="floor"
          ref={floorRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {rows.map(r => (
            <div
              key={r.id}
              className="seat"
              style={{ left: r.x, top: r.y }}     // ← 폭/높이 고정 제거
              onPointerDown={(e) => onPointerDown(e, r.id)}
              role="button"
              aria-label={`${r.name} 배치`}
            >
              <div className="seat-name">{r.name}</div>
              <button className="seat-del" onClick={(e) => { e.stopPropagation(); remove(r.id) }} aria-label="테이블 삭제">×</button>
              {/* 필요 없으면 숨김 처리되어 있음 */}
              <div className="seat-grip" aria-hidden="true">⋮⋮</div>
            </div>
          ))}
          {!rows.length && (
            <div className="floor-empty">+ 테이블 추가 버튼을 눌러 배치를 시작하세요</div>
          )}
        </div>
      </div>
    </div>
  )
}
