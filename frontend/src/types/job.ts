export interface Job {
  had_technical_test: unknown;
  technical_approval: unknown;
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
