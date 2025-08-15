import TopTabs from './components/TopTabs'
import { Route, Routes } from 'react-router-dom'
import OrdersPage from './pages/OrdersPage'
import MenuPage from './pages/MenuPage'
import TablesPage from './pages/TablesPage'
import StorePage from './pages/StorePage'
import StatsPage from './pages/StatsPage'

export default function App() {
  return (
    <div>
        <header className="topbar">
        <div className="container topbar-col">
            <div className="app-title-wrapper">
            <div className="app-title">오더프리 관리자</div>
            <div className="app-subtitle">가계 운영을 위한 통합 관리 시스템</div>
            </div>
            <TopTabs />
        </div>
        </header>

      <main className="container" style={{ paddingTop: 16 }}>
        <Routes>
          <Route path="/" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  )
}
