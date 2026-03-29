import Header from './Header'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
