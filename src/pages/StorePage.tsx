import { useState } from 'react'
import { storeInfo as seed } from '../mockData'

export default function StorePage(){
  const [info, setInfo] = useState(seed)
  const onChange = (k: keyof typeof info, v: string) => setInfo(s => ({...s, [k]: v}))
  const save = () => alert('저장되었습니다 (목업)')

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>가게 정보 관리</h3>
      <p className="muted">고객에게 보여질 가게의 기본 정보를 입력해주세요.</p>
      <div className="grid" style={{gap:12}}>
        <label>가게 이름 *<input value={info.name} onChange={e=>onChange('name', e.target.value)}
          style={{width:'100%', padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}/></label>
        <label>가게 주소<input value={info.address} onChange={e=>onChange('address', e.target.value)}
          style={{width:'100%', padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}/></label>
        <label>가게 연락처<input value={info.phone} onChange={e=>onChange('phone', e.target.value)}
          style={{width:'100%', padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}/></label>
        <label>가게 소개 (선택)<textarea value={info.desc} onChange={e=>onChange('desc', e.target.value)} rows={5}
          style={{width:'100%', padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}/></label>
        <div style={{display:'flex', justifyContent:'flex-end'}}>
          <button className="btn" onClick={save}>저장하기</button>
        </div>
      </div>
    </div>
  )
}
