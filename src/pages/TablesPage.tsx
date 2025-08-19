import { useMemo, useState } from 'react'

type TableRow = {
  id: number
  name: string
  code: string        // QR에 쓸 링크/코드 (목업)
}

export default function TablesPage() {
  // ----- 목업 데이터 -----
  const [rows, setRows] = useState<TableRow[]>([
    { id: 1, name: '1번 테이블', code: '/order?t=1' },
    { id: 2, name: '2번 테이블', code: '/order?t=2' },
    { id: 3, name: '3번 테이블', code: '/order?t=3' },
    { id: 4, name: '창가자리',   code: '/order?t=4' },
  ])
  const [selectedId, setSelectedId] = useState<number>(1)

  const selected = useMemo(
    () => rows.find(r => r.id === selectedId) ?? rows[0],
    [rows, selectedId]
  )

  // ----- 액션들 -----
  const addOne = () => {
    const name = prompt('테이블 이름을 입력하세요', `${rows.length + 1}번 테이블`)
    if (!name) return
    const id = Math.max(0, ...rows.map(r => r.id)) + 1
    setRows(list => [...list, { id, name, code: `/order?t=${id}` }])
    setSelectedId(id)
  }

  const addBulk = () => {
    const n = Number(prompt('몇 개를 일괄 추가할까요?', '3') || '0')
    if (!Number.isFinite(n) || n <= 0) return
    const maxId = Math.max(0, ...rows.map(r => r.id))
    const next: TableRow[] = Array.from({ length: n }, (_, i) => {
      const id = maxId + i + 1
      return { id, name: `${id}번 테이블`, code: `/order?t=${id}` }
    })
    setRows(list => [...list, ...next])
    setSelectedId(maxId + 1)
  }

  const remove = (id: number) => {
    const row = rows.find(r => r.id === id)
    if (!row) return
    if (!confirm(`"${row.name}"을(를) 삭제할까요?`)) return
    setRows(list => list.filter(r => r.id !== id))
    if (selectedId === id) {
      const remain = rows.filter(r => r.id !== id)
      setSelectedId(remain[0]?.id ?? 0)
    }
  }

  // 간단 인쇄: 프리뷰 박스만 새 창에 렌더링하고 print()
  const printQR = (row: TableRow) => {
    const html = `
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${row.name} QR</title>
<style>
  body{ font-family: Pretendard, -apple-system, sans-serif; padding:24px }
  .box{ width:380px; margin:0 auto; text-align:center }
  .qr{ width:320px; height:320px; margin:12px auto; border:1px solid #eee; display:grid; place-items:center; }
  .title{ font-size:20px; font-weight:800; margin:4px 0 8px }
  .muted{ color:#6b7280; font-size:14px }
  .code{ margin-top:8px; font-weight:700 }
</style>
</head>
<body>
  <div class="box">
    <div class="title">${row.name}</div>
    <div class="qr">
      <!-- 실제 QR 대신 목업 패턴 -->
      ${getMockQrSVG()}
    </div>
    <div class="muted">스마트폰 카메라로 스캔하여 주문해주세요</div>
    <div class="code">${location.origin}${row.code}</div>
  </div>
  <script>window.print()</script>
</body>
</html>`
    const w = window.open('', '_blank', 'width=480,height=620')
    if (w) {
      w.document.open()
      w.document.write(html)
      w.document.close()
    }
  }

  return (
    <div className="page page-tables">
      <div className="page container">
        {/* 상단 오른쪽 툴바 */}
        <div className="toolbar-right">
          <button className="btn ghost" onClick={addBulk}>일괄 추가</button>
          <button className="btn primary" onClick={addOne}>+ 테이블 추가</button>
        </div>

        {/* 리스트 카드 */}
        <div className="card">
          <h3 className="section-title">등록된 테이블 목록</h3>

          <table className="table">
            <thead>
              <tr>
                <th style={{textAlign:'left'}}>테이블 번호/이름</th>
                <th>QR 코드</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} onClick={() => setSelectedId(r.id)} style={{cursor:'pointer'}}>
                  <td style={{textAlign:'left'}}>
                    <div style={{display:'flex', alignItems:'center', gap:8}}>
                      <span>{r.name}</span>
                      {selectedId === r.id && <span className="badge gray">선택</span>}
                    </div>
                  </td>
                  <td>
                    <button className="btn outline" onClick={(e) => { e.stopPropagation(); printQR(r) }}>
                      <PrinterIcon /> QR코드 인쇄
                    </button>
                  </td>
                  <td>
                    <button className="btn danger" onClick={(e) => { e.stopPropagation(); remove(r.id) }}>
                      <TrashIcon /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* QR 미리보기 */}
        {selected && (
          <div className="preview-wrap">
            <div className="preview-card">
              <div className="preview-title">QR 코드 인쇄 미리보기</div>
              <div className="preview-sub">{selected.name}</div>

              <div className="preview-qr">
                {/* 실제 QR 대신 목업 패턴 */}
                <div className="qr-box" dangerouslySetInnerHTML={{ __html: getMockQrSVG() }} />
              </div>

              <div className="preview-helper">스마트폰 카메라로 스캔하여 주문해주세요</div>
              <div className="preview-code">{location.origin}{selected.code}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** 간단한 모의 QR 패턴(svg) — 실제 QR 라이브러리 없이 시각 목업용 */
function getMockQrSVG(): string {
  return `
<svg viewBox="0 0 100 100" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="4" fill="#f5f7fa" stroke="#e5e7eb"/>
  <rect x="8" y="8" width="24" height="24" fill="#111827"/>
  <rect x="68" y="8" width="24" height="24" fill="#111827"/>
  <rect x="8" y="68" width="24" height="24" fill="#111827"/>
  <!-- random dots -->
  ${[...Array(28)].map(() => {
      const x = Math.floor(Math.random()*70)+16
      const y = Math.floor(Math.random()*70)+16
      return `<rect x="${x}" y="${y}" width="6" height="6" fill="#111827" />`
    }).join('')}
</svg>`
}

/* 아이콘들 */
function PrinterIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
      <path d="M7 8V4h10v4" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="5" y="8" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="7" y="14" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}
function TrashIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight:6}}>
      <path d="M4 7h16M9 7V5h6v2M8 7l1 12h6l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}
