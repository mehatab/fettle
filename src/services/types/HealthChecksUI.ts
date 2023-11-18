export type HealthChecksUIStatus = "Unhealthy" | "Degraded" | "Healthy";

export interface HealthChecksUILiveness {
  id: number;
  name: string;
  uri: string;
  onStateFrom: string;
  lastExecuted: string;
  status: HealthChecksUIStatus;
  livenessResult: string;
  discoveryService: string | null;
  entries: Array<Check>;
  history: Array<ExecutionHistory>;
}

export interface Check {
  name: string;
  status: HealthChecksUIStatus;
  description: string | null;
  duration: string;
  tags: string[];
}

export interface ExecutionHistory {
  name: string;
  description: string | null;
  id: number;
  status: HealthChecksUIStatus;
  on: string;
}
