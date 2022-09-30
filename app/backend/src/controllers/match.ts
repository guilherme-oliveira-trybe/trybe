import { Request, Response } from 'express';
import MatchService from '../services/match';

interface Query {
  inProgress: string;
}

export default class MatchController {
  private _matchService = new MatchService();

  public async getAll(req: Request, res: Response) {
    const { inProgress } = req.query as unknown as Query;

    if (inProgress) {
      const result = await this._matchService.getByProgress(inProgress);

      return res.status(200).json(result);
    }

    const result = await this._matchService.getAll();

    return res.status(200).json(result);
  }

  // public async getByProgress(req: Request, res: Response) {
  //   const { inProgress } = req.query as unknown as Query;

  //   const result = await this._matchService.getByProgress(inProgress);

  //   return res.status(200).json(result);
  // }
}
