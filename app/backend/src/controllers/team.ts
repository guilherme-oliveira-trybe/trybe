import { Request, Response } from 'express';
import TeamService from '../services/team';

export default class TeamController {
  private _teamService = new TeamService();

  public async getAll(req: Request, res: Response) {
    const result = await this._teamService.getAll();

    return res.status(200).json(result);
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this._teamService.getById(Number(id));

    return res.status(200).json(result);
  }
}
