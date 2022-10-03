import Match from '../database/models/Match';
import Teams from '../database/models/Team';

export default class LeaderBoardService {
  private _teamModel = Teams;

  public async getLeaderBoardHome() {
    const matchesByTeam = await this.getAllMatchesByTeam();
    return matchesByTeam;
  }

  private async getAllMatchesByTeam() {
    const result = await this._teamModel.findAll({
      include: [{
        model: Match,
        as: 'homeTeam',
      }, {
        model: Match,
        as: 'awayTeam',
      }] });

    return result;
  }
}
