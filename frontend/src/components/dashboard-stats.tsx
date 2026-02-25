import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAllJobs } from "@/services/jobServices"
import { fetchAllInterviews } from "@/services/interviewServices"
import { fetchActiveJobs } from "@/services/jobServices"

export function DashboardStats() {
    const [totalJobs, setTotalJobs] = useState(0);
    const [totalInterviews, setTotalInterviews] = useState(0);
    const [activeJobs, setActiveJobs] = useState(0);

    useEffect(() => {
        async function loadData(){
            try {
                const [jobs, active, interviews] = await Promise.all([
                    fetchAllJobs(),
                    fetchActiveJobs(),
                    fetchAllInterviews()
                ]);

                setTotalJobs(jobs.length);
                setActiveJobs(active.length);
                setTotalInterviews(interviews.length);
            } catch (error) {
                console.log("Error fetching dashboard data:", error);
            }
        };

        loadData();
    }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entrevistas</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInterviews}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativas</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeJobs}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inativas</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalJobs - activeJobs}</div>
        </CardContent>
      </Card>
    </div>
  )
}