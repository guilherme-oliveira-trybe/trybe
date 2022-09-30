import Teams from '../database/models/Team';

export default class TeamService {
  private _teamModel = Teams;

  public async getAll() {
    const teams = await this._teamModel.findAll();
    return teams;
  }
}
