import { useMemo, useRef, useState } from 'react'
import { categories, menuItems as seed } from '../mockData'
import Modal from '../components/Modal'
import PopoverMenu from '../components/PopoverMenu'
import type { MenuItem } from '../types'

type FormState = Omit<MenuItem, 'id'> & { desc?: string }

const emptyForm: FormState = {
  name: '', category: '', price: 0, status: '판매중', img: '', desc: ''
}

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'전체'|string>('전체')
  const [items, setItems] = useState<MenuItem[]>(seed)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() =>
    items.filter(i =>
      (category==='전체' || i.category===category) &&
      i.name.includes(query)
    ), [items, query, category])

  // ---- CRUD ----
  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const startEdit = (row: MenuItem) => {
    setEditingId(row.id)
    setForm({ name: row.name, category: row.category, price: row.price, status: row.status, img: row.img ?? '', desc: (row as any).desc ?? '' })
    setOpen(true)
  }

  const remove = (id: number) => {
    if (confirm('이 메뉴를 삭제하시겠어요?')) setItems(list => list.filter(i => i.id !== id))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('메뉴명을 입력하세요')
    if (!form.category) return alert('카테고리를 선택하세요')
    if (form.price < 0) return alert('가격은 0 이상이어야 합니다')

    if (editingId == null) {
      const id = items.length ? Math.max(...items.map(i=>i.id)) + 1 : 1
      setItems(list => [...list, { id, ...form }])
    } else {
      setItems(list => list.map(i => i.id===editingId ? { ...i, ...form } : i))
    }
    setOpen(false)
  }

  const onPickImage = async (file: File | null) => {
    if (!file) return
    const url = URL.createObjectURL(file)      // 미리보기용 (임시 URL)
    setForm(f => ({ ...f, img: url }))
  }

  const toggleStatus = (id: number) =>
    setItems(list => list.map(i => i.id===id ? {...i, status: i.status==='판매중'?'품절':'판매중'} : i))

  return (
    <div className="card">
      {/* 상단 툴바 */}
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="메뉴명으로 검색..."
               style={{flex:1, padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}/>
        <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:'10px 12px', border:'1px solid var(--ring)', borderRadius:10}}>
          <option>전체</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn" onClick={startCreate}>+ 새 메뉴 추가</button>
      </div>

      {/* 테이블 */}
      <table className="table">
        <thead>
          <tr><th>사진</th><th>메뉴명</th><th>카테고리</th><th>가격</th><th>상태</th><th>관리</th></tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id}>
              <td>
                {m.img
                  ? <img src={m.img} alt="" style={{width:40, height:40, objectFit:'cover', borderRadius:8}}/>
                  : <div style={{width:40, height:40, background:'#f3f4f6', borderRadius:8}}/>
                }
              </td>
              <td>{m.name}</td>
              <td><span className="chip">{m.category}</span></td>
              <td>{m.price.toLocaleString()}원</td>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={m.status==='판매중'} onChange={()=>toggleStatus(m.id)}/>
                  <span className="slider"/>
                </label>
                <span style={{marginLeft:8, color: m.status==='판매중'?'#16a34a':'#ef4444'}}>{m.status}</span>
              </td>
              <td>
                <PopoverMenu items={[
                  { label:'수정', onClick: () => startEdit(m) },
                  { label:'삭제', onClick: () => remove(m.id) },
                ]}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 모달: 생성/수정 공용 */}
      <Modal open={open} onClose={()=>setOpen(false)} title={editingId==null ? '새 메뉴 추가' : '메뉴 수정'} maxWidth={720}>
        <form onSubmit={onSubmit} className="form-vert">
          {/* 이미지 업로드 */}
          <label className="f-label">메뉴 사진</label>
          <div className="upload-area" onClick={() => fileRef.current?.click()} role="button">
            {form.img
              ? <img src={form.img} alt="" style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:12}}/>
              : <div className="upload-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 16V8M8 12h8" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round"/></svg>
                  <div className="muted">클릭하여 이미지 업로드</div>
                </div>
            }
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e=>onPickImage(e.target.files?.[0] ?? null)}/>
          </div>

          {/* 이름 */}
          <label className="f-label">메뉴명</label>
          <input className="f-input" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} placeholder="메뉴명을 입력하세요" />

          {/* 가격 */}
          <label className="f-label">가격</label>
          <input className="f-input" type="number" min={0} value={form.price}
                 onChange={e=>setForm(f=>({...f, price: Number(e.target.value)}))} />

          {/* 카테고리 */}
          <label className="f-label">카테고리</label>
          <select className="f-input" value={form.category} onChange={e=>setForm(f=>({...f, category: e.target.value}))}>
            <option value="">카테고리 선택</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* 설명(선택) */}
          <label className="f-label">메뉴 설명</label>
          <textarea className="f-input" rows={5} value={form.desc} placeholder="메뉴에 대한 설명을 입력하세요"
                    onChange={e=>setForm(f=>({...f, desc: e.target.value}))} />

          {/* footer */}
          <div className="modal-footer">
            <button type="button" className="btn ghost" onClick={()=>setOpen(false)}>취소</button>
            <button type="submit" className="btn">{editingId==null ? '저장' : '수정 완료'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
