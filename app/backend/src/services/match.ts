import { Create } from '../interfaces/match';
import Match from '../database/models/Match';
import Teams from '../database/models/Team';
import CustomError from '../errors/CustomError';

export default class MatchService {
  private _matchModel = Match;
  private _isInProgress: number;
  private _isEqualTeam: boolean;

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
    const isEqualTeam = this.verifyTeams(info);
    if (isEqualTeam) {
      throw new CustomError(401, 'It is not possible to create a match with two equal teams');
    }

    const matchStatus = this.convertInProgress(info.inProgress);
    const matchInfo = { ...info, inProgress: matchStatus };

    const { id } = await this._matchModel.create(matchInfo);

    const result = await this._matchModel.findByPk(id);

    return result;
  }

  public async updateMatchProgress(id: number) {
    const match = await this._matchModel.findByPk(id);
    if (!match) throw new CustomError(404, 'Match not found');

    await this._matchModel.update({ inProgress: 0 }, { where: { id } });

    return { message: 'Finished' };
  }

  private convertInProgress(inProgress: string): number {
    if (inProgress === 'false') {
      this._isInProgress = 0;
      return this._isInProgress;
    }
    this._isInProgress = 1;

    return this._isInProgress;
  }

  private verifyTeams(info: Create): boolean {
    this._isEqualTeam = false;

    if (info.homeTeam === info.awayTeam) {
      this._isEqualTeam = true;
      return this._isEqualTeam;
    }

    return this._isEqualTeam;
  }
}
