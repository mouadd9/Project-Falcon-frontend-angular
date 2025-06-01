import { ProfileStatistics } from "../../../../core/models/statistics.model";

export interface MyProfileStatisticsState {
  profileStatistics: ProfileStatistics | null;
  loading: boolean;
  error: any | null;
}

export const initialMyProfileStatisticsState: MyProfileStatisticsState = {
  profileStatistics: null,
  loading: false,
  error: null,
};