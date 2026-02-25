export interface Job {
  id: number;
  job_title: string;
  company: string;
  is_active: boolean;
  applied_date: string;
  platform?: string;
  work_mode?: string;
  status: string;
  curriculum_id?: number;
}