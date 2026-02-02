export interface StatisticsDataPoint {
  timestamp: Date;
  value: number;
}

export interface StatisticsResponse {
  [entityId: string]: Array<{
    start: number;
    end: number;
    mean?: number;
    min?: number;
    max?: number;
    sum?: number;
    state?: number;
  }>;
}
