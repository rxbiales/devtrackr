"use client"

import * as React from "react"
import {
  Briefcase,
  LayoutDashboard,
  Timer,
  FileUser,
  PieChart,
  Settings2,
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
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Rene",
    email: "rene@devtrackr.com",
    avatar: "https://github.com/rene.png",
  },
  teams: [
    {
      name: "DevTrackr",
      logo: Briefcase,
      plan: "Personal CRM",
    },
  ],
  navMain: [
    {
      title: "Candidaturas",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Adicionar Nova Vaga", url: "#", icon: PlusCircle },
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
        <TeamSwitcher teams={data.teams} />
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