"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Target,
  TrendingUp,
  CalendarDays,
  Briefcase,
  Loader2,
} from "lucide-react";
import { getWeeklyStats } from "@/services/statsServices";

export function WeeklyMetrics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyStats().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 1. Volume Total */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-blue-500">
            <TrendingUp className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Volume Total
            </CardTitle>
          </div>
          <CardDescription>Aplicações nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">
            {data.totalApplications}
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar
                  dataKey="applications"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 2. Modelo de Trabalho */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Briefcase className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Modelo de Trabalho
            </CardTitle>
          </div>
          <CardDescription>Perfil das vagas da semana</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.workModelData}
                layout="vertical"
                margin={{ left: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="model"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  width={70}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 3. Distribuição Diária */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-purple-500">
            <CalendarDays className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Fluxo de Atividade
            </CardTitle>
          </div>
          <CardDescription>Constância diária na semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyChartData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#a855f7"
                  fill="url(#colorApp)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 4. Meta Semanal */}
      <Card>
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center gap-2 text-green-500">
            <Target className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Meta Semanal
            </CardTitle>
          </div>
          <CardDescription>Progresso atual</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="relative h-[200px] w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                data={[{ value: data.goalPercentage }]}
                startAngle={90}
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar dataKey="value" cornerRadius={10} fill="#10b981" />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{data.goalPercentage}%</span>
              <span className="text-xs text-muted-foreground text-center">
                de 30 vagas
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
