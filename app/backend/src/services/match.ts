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

  public async getByProgress(query: string) {
    let isInProgress = 1;

    if (query === 'false') {
      isInProgress = 0;
    }

    const matches = await this._matchModel.findAll({ where: { inProgress: isInProgress },
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
}
