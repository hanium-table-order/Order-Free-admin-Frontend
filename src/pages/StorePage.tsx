import { useState } from 'react'
import type { FormEvent } from 'react'
import { storeInfo as seed } from '../mockData'


export default function StorePage() {
  const [info, setInfo] = useState(seed)
  const onChange = (k: keyof typeof info, v: string) => setInfo(s => ({ ...s, [k]: v }))
  const save = () => alert('저장되었습니다 (목업)')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    save()
  }

  return (
    <div className="page page-store">
      <div className="container">
        {/* 헤더 */}
        <h1 className="page-title"></h1>
        {/* 본문 */}
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="section">
              <div className="section-title">기본 정보</div>

              {/* 가게 이름 */}
              <div className="field inline">
                <label htmlFor="store-name" className="f-label">가게 이름 <span aria-hidden="true">*</span></label>
                <div>
                  <input
                    id="store-name"
                    className="input"
                    value={info.name}
                    onChange={e => onChange('name', e.target.value)}
                    placeholder="예) 오더프리 한남점"
                    required
                    aria-required="true"
                  />
                  <div className="f-help">주문 페이지 상단과 메타 정보에 노출됩니다.</div>
                </div>
              </div>

              {/* 가게 주소 */}
              <div className="field inline">
                <label htmlFor="store-address" className="f-label">가게 주소</label>
                <div>
                  <input
                    id="store-address"
                    className="input"
                    value={info.address}
                    onChange={e => onChange('address', e.target.value)}
                    placeholder="도로명 주소"
                  />
                </div>
              </div>

              {/* 가게 연락처 */}
              <div className="field inline">
                <label htmlFor="store-phone" className="f-label">가게 연락처</label>
                <div>
                  <input
                    id="store-phone"
                    className="input"
                    value={info.phone}
                    onChange={e => onChange('phone', e.target.value)}
                    placeholder="예) 02-123-4567"
                    inputMode="tel"
                  />
                </div>
              </div>

              {/* 가게 소개 */}
              <div className="field inline">
                <label htmlFor="store-desc" className="f-label">가게 소개 (선택)</label>
                <div>
                  <textarea
                    id="store-desc"
                    className="input"
                    rows={5}
                    value={info.desc}
                    onChange={e => onChange('desc', e.target.value)}
                    placeholder="가게의 특징, 대표 메뉴, 영업 안내 등을 작성해주세요."
                  />
                  <div className="f-help">소개 문구는 주문 페이지 하단 소개 영역에 노출됩니다.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 저장 바 */}
          <div className="savebar">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setInfo(seed)}
              aria-label="변경사항 취소"
            >
              취소
            </button>
            <button type="submit" className="btn primary" aria-label="가게 정보 저장">
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
