import { Request, Response } from 'express';
import LeaderBoardService from '../services/leaderBoard';

export default class LeaderBoardController {
  private _leaderService = new LeaderBoardService();

  public async getAllMatchesByTeam(req: Request, res: Response) {
    const result = await this._leaderService.getLeaderBoardHome();
    res.status(200).json(result);
  }
}
