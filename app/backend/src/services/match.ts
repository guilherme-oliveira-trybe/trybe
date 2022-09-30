import Match from '../database/models/Match';
import Teams from '../database/models/Team';

export default class MatchService {
  private _matchModel = Match;

  public async getAll() {
    const matches = await this._matchModel.findAll({
      include: [{
        model: Teams,
        as: 'teamHome',
        attributes: ['teamName'],
      }, {
        model: Teams,
        as: 'teamAway',
        attributes: ['teamName'],
      }],
    });
    return matches;
  }

  // public async getById(id: number) {
  //   const team = await this._teamModel.findByPk(id);
  //   return team;
  // }
}
