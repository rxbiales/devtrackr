export interface Interview {
  id: number;
  job_id: number;
  interview_date: string;
  location?: string;
  notes?: string;
}

export interface Curriculum {
  id: number;
  name: string;
  file_path: string;
  version?: string; 
  created_at: string;
}

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