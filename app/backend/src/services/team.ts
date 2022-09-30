import Teams from '../database/models/Team';

export default class TeamService {
  private _teamModel = Teams;

  public async getAll() {
    const teams = await this._teamModel.findAll();
    return teams;
  }

  public async getById(id: number) {
    const team = await this._teamModel.findByPk(id);
    return team;
  }
}
