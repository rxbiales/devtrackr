"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Layers, FileText, Zap, Briefcase, Loader2 } from "lucide-react";
import { getConversionStats } from "@/services/statsServices";

const COLORS = ["#3b82f6", "#a855f7", "#10b981", "#f59e0b"];

export function ConversionMetrics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversionStats().then((res) => {
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
      {/* 1. Taxa de Resposta */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Zap className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Taxa de Resposta
            </CardTitle>
          </div>
          <CardDescription>Aplicações que geraram contato</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center h-[220px]">
          <div className="flex justify-around items-end gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {data.globalConv}%
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Geral
              </p>
            </div>
            <div className="text-center pb-2">
              <div className="text-2xl font-semibold text-purple-500">
                {data.recentConv}%
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Últimas 2 semanas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Uso de Currículos */}
      <Card>
        <CardHeader className="pb-2 text-slate-500">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Uso de Currículos
            </CardTitle>
          </div>
          <CardDescription>Distribuição por versão utilizada</CardDescription>
        </CardHeader>
        <CardContent className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.resumeData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.resumeData.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Funil Técnico */}
      <Card>
        <CardHeader className="pb-2 text-green-500">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Funil Técnico
            </CardTitle>
          </div>
          <CardDescription>Avanço em desafios e testes</CardDescription>
        </CardHeader>
        <CardContent className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.funnelData}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e2e8f0"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="step"
                type="category"
                axisLine={false}
                tickLine={false}
                fontSize={12}
                width={100}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="count"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Foco de Carreira */}
      <Card>
        <CardHeader className="pb-2 text-orange-500">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <CardTitle className="text-sm font-medium text-foreground">
              Foco de Carreira
            </CardTitle>
          </div>
          <CardDescription>Cargos com maior volume</CardDescription>
        </CardHeader>
        <CardContent className="h-[220px] pt-4">
          <div className="space-y-4">
            {data.topTitles.map((item: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-tighter">
                  <span className="truncate max-w-[180px]">{item.name}</span>
                  <span className="text-orange-600 font-bold">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${(item.count / (data.topTitles[0]?.count || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
