import { Route, Routes } from 'react-router-dom'
import TopTabs from './components/TopTabs'
import OrdersPage from './pages/OrdersPage'
import MenuPage from './pages/MenuPage'
import TablesPage from './pages/TablesPage'
import StorePage from './pages/StorePage'
import StatsPage from './pages/StatsPage'

// 다른 탭용 임시 페이지 (에러 방지용 간단 스텁)

export default function App() {
  return (
    <>
      <header className="topbar">
        <div className="container">
          <div className="header-stack">
            <div className="app-title">오더프리 관리자</div>
            <div className="app-subtitle">가계 운영을 위한 통합 관리 시스템</div>
          </div>
          <div className="tabs-wrap">
            <TopTabs />
          </div>
        </div>
      </header>

      <main className="page page-orders">
        <div className="container">
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </main>
    </>
  )
}
