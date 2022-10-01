import { Create } from '../interfaces/match';
import Match from '../database/models/Match';
import Teams from '../database/models/Team';

export default class MatchService {
  private _matchModel = Match;
  private _isInProgress: number;

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
    const matchStatus = this.convertInProgress(query);

    const matches = await this._matchModel.findAll({ where: { inProgress: matchStatus },
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

  public async create(info: Create) {
    const matchStatus = this.convertInProgress(info.inProgress);
    const matchInfo = { ...info, inProgress: matchStatus };

    const { id } = await this._matchModel.create(matchInfo);

    const result = await this._matchModel.findByPk(id);

    return result;
  }

  private convertInProgress(inProgress: string): number {
    if (inProgress === 'false') {
      this._isInProgress = 0;
    }
    this._isInProgress = 1;

    return this._isInProgress;
  }
}
