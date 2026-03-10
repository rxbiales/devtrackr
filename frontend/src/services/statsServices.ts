import { fetchAllJobs } from "./jobServices";
import { fetchAllCurriculums } from "./curriculumServices";

/**
 * Métrica 1: Ritmo Semanal
 */
export async function getWeeklyStats() {
  const jobs = await fetchAllJobs();
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const weeklyJobs = jobs.filter(
    (job: any) => new Date(job.applied_date) >= sevenDaysAgo,
  );

  const daysMap: Record<string, number> = {
    Seg: 0,
    Ter: 0,
    Qua: 0,
    Qui: 0,
    Sex: 0,
    Sáb: 0,
    Dom: 0,
  };
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  weeklyJobs.forEach((job: any) => {
    const dayName = weekdays[new Date(job.applied_date).getDay()];
    if (daysMap[dayName] !== undefined) daysMap[dayName]++;
  });

  const weeklyChartData = Object.entries(daysMap).map(([day, count]) => ({
    day,
    applications: count,
  }));

  const modelsMap: Record<string, number> = {
    Remoto: 0,
    Híbrido: 0,
    Presencial: 0,
  };
  weeklyJobs.forEach((job: any) => {
    const model = job.work_mode || "Presencial";
    if (modelsMap[model] !== undefined) modelsMap[model]++;
  });

  const workModelData = [
    { model: "Remoto", count: modelsMap["Remoto"], fill: "#3b82f6" },
    { model: "Híbrido", count: modelsMap["Híbrido"], fill: "#a855f7" },
    { model: "Presencial", count: modelsMap["Presencial"], fill: "#64748b" },
  ];

  return {
    weeklyChartData,
    workModelData,
    totalApplications: weeklyJobs.length,
    goalPercentage: Math.min(Math.round((weeklyJobs.length / 30) * 100), 100),
  };
}

/**
 * Métrica 2: Eficiência do Funil
 */
export async function getConversionStats() {
  const [jobs] = await Promise.all([fetchAllJobs(), fetchAllCurriculums()]);

  const totalJobs = jobs.length;

  const successStatuses = ["interviewing", "interview", "offer"];
  const respondedJobsCount = jobs.filter((j: any) =>
    successStatuses.includes(j.status?.toLowerCase()),
  ).length;

  const globalConv =
    totalJobs > 0 ? ((respondedJobsCount / totalJobs) * 100).toFixed(1) : "0.0";

  const funnelData = [
    {
      step: "Testes",
      count: jobs.filter(
        (j: any) => j.had_technical_test || j.challenges?.length > 0,
      ).length,
      fill: "#8884d8",
    },
    {
      step: "Aprovação",
      count: jobs.filter((j: any) => j.technical_approval).length,
      fill: "#82ca9d",
    },
    {
      step: "Propostas",
      count: jobs.filter((j: any) => j.status?.toLowerCase() === "offer")
        .length,
      fill: "#ffc658",
    },
  ];

  const resumeMap: Record<string, number> = {};

  const resumeData = Object.entries(resumeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const titleMap: Record<string, number> = {};
  jobs.forEach((job: any) => {
    const title = job.job_title?.trim() || "Não informado";
    titleMap[title] = (titleMap[title] || 0) + 1;
  });

  const topTitles = Object.entries(titleMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  return {
    globalConv,
    recentConv: globalConv,
    resumeData,
    funnelData,
    topTitles,
  };
}
