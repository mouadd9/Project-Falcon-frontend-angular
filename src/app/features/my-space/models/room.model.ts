// Interface matching backend RoomDTO
// when room data comes from the backend it will be in this form
export interface RoomModel {
    id: number;
    amiId: string;
    title: string;
    description: string;
    complexity: 'EASY' | 'MEDIUM' | 'HARD' ;
    imageURL: string;
    estimatedTime: number;
    totalChallenges: number;
    totalRunningInstances: number;
    totalJoinedUsers: number;
    challenges: any[]; // Will be empty for list endpoints
    isSaved: boolean;
    isJoined: boolean;
    percentageCompleted: number;
  }