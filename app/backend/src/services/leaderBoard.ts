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

  private checkInfoHome = (info: InfoMatches[]) => {
    let rng = {
      points: 0, victories: 0, draws: 0, losses: 0, goalsFavor: 0, goalsOwn: 0 };

    info.forEach((match) => {
      if (match.homeTeamGoals === match.awayTeamGoals) {
        rng = { ...rng, draws: rng.draws + 1, points: rng.points + 1 };
      } else if (match.homeTeamGoals > match.awayTeamGoals) {
        rng = { ...rng, victories: rng.victories += 1, points: rng.points += 3 };
      } else { rng.losses += 1; }

      rng.goalsFavor += match.homeTeamGoals;
      rng.goalsOwn += match.awayTeamGoals;
    });

    const totalGames = info.length;
    const goalsBalance = rng.goalsFavor - rng.goalsOwn;
    const efficiency = Number(((rng.points / (totalGames * 3)) * 100).toFixed(2));

    return { ...rng, totalGames, goalsBalance, efficiency };
  };

  private checkInfoAway = (info: InfoMatches[]) => {
    let rng = {
      points: 0, victories: 0, draws: 0, losses: 0, goalsFavor: 0, goalsOwn: 0 };

    info.forEach((match) => {
      if (match.awayTeamGoals === match.homeTeamGoals) {
        rng = { ...rng, draws: rng.draws + 1, points: rng.points + 1 };
      } else if (match.awayTeamGoals > match.homeTeamGoals) {
        rng = { ...rng, victories: rng.victories += 1, points: rng.points += 3 };
      } else { rng.losses += 1; }

      rng.goalsFavor += match.awayTeamGoals;
      rng.goalsOwn += match.homeTeamGoals;
    });

    const totalGames = info.length;
    const goalsBalance = rng.goalsFavor - rng.goalsOwn;
    const efficiency = Number(((rng.points / (totalGames * 3)) * 100).toFixed(2));

    return { ...rng, totalGames, goalsBalance, efficiency };
  };

  private handleInfo = (array: TeamInfoMatches[], status: FieldType) => {
    const infoHome = array.map((team) => {
      const check = status === 'home'
        ? this.checkInfoHome(team.homeTeam) : this.checkInfoAway(team.awayTeam);

      const result = {
        name: team.teamName,
        totalPoints: check.points,
        totalGames: check.totalGames,
        totalVictories: check.victories,
        totalDraws: check.draws,
        totalLosses: check.losses,
        goalsFavor: check.goalsFavor,
        goalsOwn: check.goalsOwn,
        goalsBalance: check.goalsBalance,
        efficiency: check.efficiency,
      };

      return result;
    });
    return infoHome;
  };

  private handleGeneralRanking = (array: TeamInfoMatches[]) => {
    const infoHome = array.map((team) => {
      const matchesHome = this.checkInfoHome(team.homeTeam);
      const matchesAway = this.checkInfoAway(team.awayTeam);

      const result = {
        name: team.teamName,
        totalPoints: matchesHome.points + matchesAway.points,
        totalGames: matchesHome.totalGames + matchesAway.totalGames,
        totalVictories: matchesHome.victories + matchesAway.victories,
        totalDraws: matchesHome.draws + matchesAway.draws,
        totalLosses: matchesHome.losses + matchesAway.losses,
        goalsFavor: matchesHome.goalsFavor + matchesAway.goalsFavor,
        goalsOwn: matchesHome.goalsOwn + matchesAway.goalsOwn,
        goalsBalance: matchesHome.goalsBalance + matchesAway.goalsBalance,
      };

      return { ...result,
        efficiency: Number(((result.totalPoints / (result.totalGames * 3)) * 100).toFixed(2)) };
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
}
