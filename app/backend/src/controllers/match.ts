import { Request, Response } from 'express';
import { Create } from '../interfaces/match';
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

  public async create(req: Request, res: Response) {
    const info = req.body as Create;

    const result = await this._matchService.create(info);

    return res.status(201).json(result);
  }

  public async updateMatchProgress(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this._matchService.updateMatchProgress(Number(id));

    return res.status(200).json(result);
  }
}
