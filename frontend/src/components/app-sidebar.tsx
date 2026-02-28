"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Timer,
  FileUser,
  PieChart,
  PlusCircle,
  TableProperties,
  MessageSquareMore,
  CodeXml,
  CalendarClock,
  ExternalLink,
  Files,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Rene",
    email: "rene@devtrackr.com",
    avatar: "https://github.com/rene.png",
  },
  navMain: [
    {
      title: "Candidaturas",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Adicionar Nova Vaga", url: "/applications/create-job", icon: PlusCircle },
        { title: "Painel de Triagem", url: "#", icon: LayoutDashboard },
        { title: "Lista Geral", url: "#", icon: TableProperties },
      ],
    },
    {
      title: "Processos Ativos",
      url: "#",
      icon: Timer,
      items: [
        { title: "Aguardando Resposta", url: "#", icon: MessageSquareMore },
        { title: "Desafios Técnicos", url: "#", icon: CodeXml },
        { title: "Agenda de Entrevistas", url: "#", icon: CalendarClock },
      ],
    },
    {
      title: "Recursos",
      url: "#",
      icon: FileUser,
      items: [
        { title: "Meus Currículos", url: "#", icon: Files },
        { title: "Portfólios e Links", url: "#", icon: ExternalLink },
      ],
    },
    {
      title: "Analytics",
      url: "/stats",
      icon: PieChart,
      items: [
        { title: "Métricas Semanais", url: "#" },
        { title: "Taxa de Conversão", url: "#" },
        { title: "Vagas Rejeitadas", url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent transition-colors">
              <Link href="/">
                {/* Removido o bg-sidebar-primary e as cores de texto forçadas */}
                <div className="flex aspect-square size-8 items-center justify-center">
                  <img 
                    src="/coffee-cup.png" 
                    alt="Logo" 
                    className="size-7 object-contain" 
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    DevTrackr
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/60">
                    Personal CRM
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}