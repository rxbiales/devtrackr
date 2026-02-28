import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import "./global.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <div className="flex items-center gap-2 p-4">
              <SidebarTrigger />
            </div>
            {/* O children injeta o conteúdo de cada página (Dashboard, Nova Vaga, etc) */}
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  )
}