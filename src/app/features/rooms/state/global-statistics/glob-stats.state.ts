import { GlobalRoomStats } from "../../../../core/models/statistics.model";

export interface GlobalStatisticsState {
  globalStatistics: GlobalRoomStats | null;
  loading: boolean;
  error: any | null;
}

export const initialGlobalStatisticsState: GlobalStatisticsState = {
  globalStatistics: null,
  loading: false,
  error: null,
};