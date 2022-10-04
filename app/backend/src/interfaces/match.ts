export interface UpdateInfo {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface Create extends UpdateInfo {
  homeTeam: number;
  awayTeam: number;
  inProgress: string;
}

export interface InfoMatches extends Create {
  id: number;
}

export interface TeamInfoMatches {
  id: number;
  teamName: string;
  homeTeam: InfoMatches[];
  awayTeam: InfoMatches[];
}

export interface MatchesResult {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number,
}
