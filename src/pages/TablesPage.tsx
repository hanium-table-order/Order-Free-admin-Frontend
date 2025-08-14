import { useState } from 'react'
import { tables as seed } from '../mockData'

export default function TablesPage(){
  const [tables, setTables] = useState(seed)
  const addTable = () => {
    const id = Math.max(...tables.map(t=>t.id)) + 1
    const name = prompt('테이블 이름을 입력하세요', `${id}번 테이블`)
    if(name) setTables(list => [...list, {id, name}])
  }
  const remove = (id:number) => setTables(list => list.filter(t=>t.id!==id))

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <h3 style={{margin:0}}>등록된 테이블 목록</h3>
          <div style={{display:'flex', gap:8}}>
            <button className="btn ghost">일괄 추가</button>
            <button className="btn" onClick={addTable}>+ 테이블 추가</button>
          </div>
        </div>
        <table className="table">
          <thead><tr><th>테이블 번호/이름</th><th>QR 코드</th><th>관리</th></tr></thead>
          <tbody>
            {tables.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td><button className="btn ghost">QR코드 인쇄</button></td>
                <td><button className="btn" style={{background:'#ef4444'}} onClick={()=>remove(t.id)}>삭제</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div style={{textAlign:'center'}}>
          <h3>QR 코드 인쇄 미리보기</h3>
          <div style={{width:160, height:160, border:'1px dashed var(--ring)', margin:'16px auto',
                       borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center'}}>QR</div>
          <div className="muted">선택된 테이블의 QR이 여기에 표시됩니다.</div>
        </div>
      </div>
    </div>
  )
}
