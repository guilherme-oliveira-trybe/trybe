export interface UpdateInfo {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface Create extends UpdateInfo {
  homeTeam: number;
  awayTeam: number;
  inProgress: string;
}
