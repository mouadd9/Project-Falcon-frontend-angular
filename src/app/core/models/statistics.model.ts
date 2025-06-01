// filepath: project-falcon/src/app/core/models/statistics.model.ts
export interface StatDetail {
  total: number;
  completed: number;
}

export interface ProfileStatistics {
  joinedRooms: number;
  completedRooms: number;
  activeInstances: number;
  dailyStreak: number;
}

export interface GlobalRoomStats {
  totalRooms: StatDetail;
  easyRooms: StatDetail;
  mediumRooms: StatDetail;
  hardRooms: StatDetail;
}