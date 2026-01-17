
export interface Requirement {
  label: string;
  type: 'HARD' | 'SOFT';
  status: 'MET' | 'UNMET' | 'PARTIAL';
  explanation: string;
}

export interface AnalysisResult {
  score: number;
  classification: string;
  summary: string;
  hardRequirementGapsCount: number;
  requirements: Requirement[];
  gaps: string[];
  strengths: string[];
  recommendations: string[];
}

export interface InputData {
  jdText: string;
  cvText: string;
  cvImageBase64?: string;
  cvImageMimeType?: string;
}
