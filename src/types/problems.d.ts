export interface ProblemInfo {
  slug: string;
  name: string;
  uuid: string;
  practices: never[];
  prerequisites: string[];
  difficulty: number;
  topics?: string[];
  status?: string;
}

export interface Problem {
  code: string;
  spec: string;
  instructions: string;
}

export default ProblemInfo;