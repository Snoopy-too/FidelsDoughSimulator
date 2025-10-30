
export interface SimulationParams {
  idy: number;
  salt: number;
  hydration: number;
  temperature: number;
}

export interface Milestone {
  id: number;
  label: string;
  time: number; // in minutes
}
