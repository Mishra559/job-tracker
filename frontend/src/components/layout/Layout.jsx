import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1e] grid-bg">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
