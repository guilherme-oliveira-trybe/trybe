import { Request, Response } from 'express';
import MatchService from '../services/match';

export default class MatchController {
  private _matchService = new MatchService();

  public async getAll(req: Request, res: Response) {
    const result = await this._matchService.getAll();

    return res.status(200).json(result);
  }

  // public async getById(req: Request, res: Response) {
  //   const { id } = req.params;

  //   const result = await this._teamService.getById(Number(id));

  //   return res.status(200).json(result);
  // }
}
