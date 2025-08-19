import React from 'react'
import { NavLink } from 'react-router-dom'

type Tab = { to: string; label: string; icon: React.ReactNode }

const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)
const IconTables = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M6 9v10M18 9v10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)
const IconStore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 9l2-4h12l2 4M6 9v9h12V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconStats = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

const tabs: Tab[] = [
  { to: '/',       label: '실시간 주문', icon: <IconOrders/> },
  { to: '/menu',   label: '메뉴 관리',   icon: <IconMenu/> },
  { to: '/tables', label: '테이블 관리', icon: <IconTables/> },
  { to: '/store',  label: '가게 설정',   icon: <IconStore/> },
  { to: '/stats',  label: '매출 통계',   icon: <IconStats/> },
]

export default function TopTabs() {
  return (
    <div className="tabs-bar">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to==='/'}
          className={({isActive}) => 'tab-pill' + (isActive ? ' active' : '')}
        >
          <span className="tab-ico">{t.icon}</span>
          <span className="tab-label">{t.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
