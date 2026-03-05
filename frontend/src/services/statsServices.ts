import { fetchAllJobs } from "./jobServices";
import { fetchAllCurriculums } from "./curriculumServices"; // [cite: 2026-03-04]

/**
 * Métrica 1: Ritmo Semanal
 */
export async function getWeeklyStats() {
  const jobs = await fetchAllJobs(); // [cite: 2026-03-04]
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
    goalPercentage: Math.min(Math.round((weeklyJobs.length / 30) * 100), 100), // [cite: 2026-02-25]
  };
}

/**
 * Métrica 2: Eficiência do Funil
 */
export async function getConversionStats() {
  const [jobs, curriculums] = await Promise.all([
    fetchAllJobs(),
    fetchAllCurriculums(), // [cite: 2026-03-04]
  ]);

  const totalJobs = jobs.length;
  const curriculumMap = new Map(curriculums.map((c: any) => [c.id, c.name]));

  // 1. Taxa de Resposta (Soma apenas avanços reais)
  const successStatuses = ["interviewing", "interview", "offer"];
  const respondedJobsCount = jobs.filter((j: any) =>
    successStatuses.includes(j.status?.toLowerCase()),
  ).length;

  const globalConv =
    totalJobs > 0 ? ((respondedJobsCount / totalJobs) * 100).toFixed(1) : "0.0";

  // 2. Funil Técnico
  const funnelData = [
    {
      step: "Testes",
      count: jobs.filter(
        (j: any) =>
          j.had_technical_test === true ||
          (j.challenges && j.challenges.length > 0),
      ).length,
      fill: "#8884d8",
    },
    {
      step: "Aprovação",
      count: jobs.filter((j: any) => j.technical_approval === true).length,
      fill: "#82ca9d",
    },
    {
      step: "Propostas",
      count: jobs.filter((j: any) => j.status?.toLowerCase() === "offer")
        .length,
      fill: "#ffc658",
    },
  ];

  // 3. Uso de Currículos
  const resumeMap: Record<string, number> = {};
  jobs.forEach((job: any) => {
    const name = job.curriculum_id
      ? curriculumMap.get(job.curriculum_id)
      : "Sem currículo vinculado";
    resumeMap[name] = (resumeMap[name] || 0) + 1;
  });

  const resumeData = Object.entries(resumeMap).map(([name, value]) => ({
    name: name || "Padrão",
    value,
  }));

  // 4. Foco de Carreira
  const titleMap: Record<string, number> = {};
  jobs.forEach((job: any) => {
    const title = job.job_title?.trim() || "Título não informado";
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
