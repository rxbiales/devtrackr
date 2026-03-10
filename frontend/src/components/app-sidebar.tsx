"use client";

import * as React from "react";
import Link from "next/link";
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
  Files,
  User,
  LogOut,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navMainData = [
  {
    title: "Candidaturas",
    url: "#",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Adicionar Nova Vaga",
        url: "/applications/create-job",
        icon: PlusCircle,
      },
      {
        title: "Lista Geral",
        url: "/applications/list",
        icon: TableProperties,
      },
    ],
  },
  {
    title: "Processos Ativos",
    url: "#",
    icon: Timer,
    items: [
      {
        title: "Aguardando Resposta",
        url: "/processes/waiting-response",
        icon: MessageSquareMore,
      },
      {
        title: "Desafios Técnicos",
        url: "/processes/challenges-agenda",
        icon: CodeXml,
      },
      {
        title: "Agenda de Entrevistas",
        url: "/processes/interviews-agenda",
        icon: CalendarClock,
      },
    ],
  },
  {
    title: "Recursos",
    url: "#",
    icon: FileUser,
    items: [{ title: "Meus Currículos", url: "/resources/cvs", icon: Files }],
  },
  {
    title: "Analytics",
    url: "/stats",
    icon: PieChart,
    items: [
      { title: "Métricas Semanais", url: "/stats/weekly" },
      { title: "Taxa de Conversão", url: "/stats/conversion-rate" },
      { title: "Vagas Rejeitadas", url: "/stats/deactivated-list" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userEmail, setUserEmail] = React.useState("Carregando...");

  React.useEffect(() => {
    setUserEmail(localStorage.getItem("user_email") || "Não autenticado");
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user_email");
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-sidebar-accent transition-colors"
            >
              <Link href="/">
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
        <NavMain items={navMainData} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="border-t border-sidebar-border pt-2">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-accent text-sidebar-accent-foreground">
                <User className="size-4" />
              </div>
              <div className="grid flex-1 overflow-hidden text-left">
                <span className="truncate text-xs font-medium text-sidebar-foreground">
                  {userEmail}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto rounded-md p-2 hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
