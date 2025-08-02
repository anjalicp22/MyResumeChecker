export interface Application {
  _id: string;
  title: string;
  experience?: string;
  location?: string;
  jobDescription?: string;
  lastDate?: string;
  portal?: string;
  interviewProcess?: string;
  interviewDate?: string;
  status: string;
  resumeUsed?: string;
  analysisResult?: AnalysisResult | null;
}

export interface Resume {
  _id: string;
  filename: string;
}

export interface AnalysisResult {
  required_skills: string[];
  missing_skills: string[];
}

export interface RecommendResult {
  filename: string;
  score: number;
  rid: string;
}
