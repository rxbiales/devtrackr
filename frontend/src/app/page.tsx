import { AppSidebar } from "../components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { DashboardStats } from "../components/dashboard/dashboard-stats"

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-6 space-y-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
        </div>
        
        <DashboardStats />
      </main>
    </SidebarProvider>
  )
}

export default App