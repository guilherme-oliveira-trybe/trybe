import { FieldType, InfoMatches, MatchesResult, TeamInfoMatches } from '../interfaces/match';
import Match from '../database/models/Match';
import Teams from '../database/models/Team';

export default class LeaderBoardService {
  private _teamModel = Teams;

  public async getLeaderBoardHome() {
    const matchesByTeam = await this.getAllMatchesByTeam();
    const matchesInfo = this.handleInfo(matchesByTeam, 'home');
    const orderResult = this.orderMatchResult(matchesInfo);
    return orderResult;
  }

  public async getLeaderBoardAway() {
    const matchesByTeam = await this.getAllMatchesByTeam();
    const matchesInfo = this.handleInfo(matchesByTeam, 'away');
    const orderResult = this.orderMatchResult(matchesInfo);
    return orderResult;
  }

  public async getLeaderBoard() {
    const matchesByTeam = await this.getAllMatchesByTeam();
    const matchesInfo = this.handleGeneralRanking(matchesByTeam);
    const orderResult = this.orderMatchResult(matchesInfo);
    return orderResult;
  }

  private async getAllMatchesByTeam() {
    const result = await this._teamModel.findAll({
      include: [{
        model: Match,
        as: 'homeTeam',
        where: { inProgress: 0 },
      }, {
        model: Match,
        as: 'awayTeam',
        where: { inProgress: 0 },
      }],
    });

    return result as unknown as TeamInfoMatches[];
  }

  private handleGeneralRanking = (array: TeamInfoMatches[]) => {
    const infoHome = array.map((team) => {
      const matchesHome = this.handleResults(team.homeTeam, 'home'); // tirar status
      const matchesAway = this.handleResults(team.awayTeam, 'away'); // tirar status

      const result = {
        name: team.teamName,
        totalPoints: matchesHome.totalPoints + matchesAway.totalPoints,
        totalGames: matchesHome.totalGames + matchesAway.totalGames,
        totalVictories: matchesHome.totalVictories + matchesAway.totalVictories,
        totalDraws: matchesHome.totalDraws + matchesAway.totalDraws,
        totalLosses: matchesHome.totalLosses + matchesAway.totalLosses,
        goalsFavor: matchesHome.goalsFavor + matchesAway.goalsFavor,
        goalsOwn: matchesHome.goalsOwn + matchesAway.goalsOwn,
      };

      return { ...result,
        goalsBalance: this.handleGoalsBalance(result.goalsFavor, result.goalsOwn),
        efficiency: this.handleEfficiency(result.totalPoints, result.totalGames) };
    });
    return infoHome;
  };

  private orderMatchResult = (results: MatchesResult[]) => {
    const sortByGoalsOwn = results.sort((a, b) => a.goalsOwn - b.goalsOwn);
    const sortByGoalsFavor = sortByGoalsOwn.sort((a, b) => b.goalsFavor - a.goalsFavor);
    const sortByGoalsBalance = sortByGoalsFavor.sort((a, b) => b.goalsBalance - a.goalsBalance);
    const sortByTotalPoints = sortByGoalsBalance.sort((a, b) => b.totalPoints - a.totalPoints);

    return sortByTotalPoints;
  };

  private handleInfo = (array: TeamInfoMatches[], status: FieldType) => {
    const infoHome = array.map((team) => {
      const check = status === 'home'
        ? this.handleResults(team.homeTeam, status) : this.handleResults(team.awayTeam, status);

      const result = {
        name: team.teamName,
        totalPoints: check.totalPoints,
        totalGames: check.totalGames,
        totalVictories: check.totalVictories,
        totalDraws: check.totalDraws,
        totalLosses: check.totalLosses,
        goalsFavor: check.goalsFavor,
        goalsOwn: check.goalsOwn,
        goalsBalance: this.handleGoalsBalance(check.goalsFavor, check.goalsOwn),
        efficiency: this.handleEfficiency(check.totalPoints, check.totalGames),
      };

      return result;
    });
    return infoHome;
  };

  private handleResults = (info: InfoMatches[], status: FieldType) => {
    const resultMatches = info.reduce((acc, match) => {
      const result = this.handleSumInfos(match, status);
      acc.totalPoints += result.totalPoints;
      acc.totalVictories += result.totalVictories;
      acc.totalDraws += result.totalDraws;
      acc.totalLosses += result.totalLosses;
      acc.goalsFavor += result.goalsFavor;
      acc.goalsOwn += result.goalsOwn;

      return acc;
    }, {
      totalPoints: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
    });

    return { ...resultMatches, totalGames: info.length };
  };

  private handleSumInfos = (match: InfoMatches, status: FieldType) => {
    const tiedMatch = this.handleTiedMatch(match.homeTeamGoals, match.awayTeamGoals); // passar status partida aqui
    const victoreMatch = status === 'home'
      ? this.handleVictoryMatch(match.homeTeamGoals, match.awayTeamGoals)
      : this.handleVictoryMatch(match.awayTeamGoals, match.homeTeamGoals);

    const lossMatch = status === 'home'
      ? this.handleLosseMatch(match.homeTeamGoals, match.awayTeamGoals)
      : this.handleLosseMatch(match.awayTeamGoals, match.homeTeamGoals);

    const result = {
      totalPoints: tiedMatch.points + victoreMatch.points,
      totalVictories: victoreMatch.victories,
      totalDraws: tiedMatch.draws,
      totalLosses: lossMatch,
      goalsFavor: status === 'home' ? match.homeTeamGoals : match.awayTeamGoals,
      goalsOwn: status === 'home' ? match.awayTeamGoals : match.homeTeamGoals,
    }; // fazer as somas aqui

    return result;
  };

  private handleTiedMatch = (goalsFavor: number, goalsOwn: number) => {
    let draws = 0;
    let points = 0;

    if (goalsFavor === goalsOwn) {
      draws += 1;
      points += 1;
    }

    return { draws, points };
  };

  private handleVictoryMatch = (goalsFavor: number, goalsOwn: number) => {
    let victories = 0;
    let points = 0;

    if (goalsFavor > goalsOwn) {
      victories += 1;
      points += 3;
    }

    return { victories, points };
  };

  private handleLosseMatch = (goalsFavor: number, goalsOwn: number) => {
    let losses = 0;

    if (goalsFavor < goalsOwn) {
      losses += 1;
    }

    return losses;
  };

  private handleGoalsBalance = (totalGoalsFavor: number, totalGoalsOwn: number) => {
    const goalsBalanceResult = totalGoalsFavor - totalGoalsOwn;

    return goalsBalanceResult;
  };

  private handleEfficiency = (totalPoints: number, totalGames: number) => {
    const efficiencyResult = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

    return efficiencyResult;
  };
}
