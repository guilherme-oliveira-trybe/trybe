import { Request, Response } from 'express';
import LeaderBoardService from '../services/leaderBoard';

export default class LeaderBoardController {
  private _leaderService = new LeaderBoardService();

  public async getLeaderBoardHome(req: Request, res: Response) {
    const result = await this._leaderService.getLeaderBoardHome();
    res.status(200).json(result);
  }

  public async getLeaderBoardAway(req: Request, res: Response) {
    const result = await this._leaderService.getLeaderBoardAway();
    res.status(200).json(result);
  }

  public async getLeaderBoard(req: Request, res: Response) {
    const result = await this._leaderService.getLeaderBoard();
    res.status(200).json(result);
  }
}
