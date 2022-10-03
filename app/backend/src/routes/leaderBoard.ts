import { Router } from 'express';
import LeaderBoardController from '../controllers/leaderBoard';

const leaderBoardController = new LeaderBoardController();
const leaderBoardRoute = Router();

leaderBoardRoute.get('/home', (req, res) => leaderBoardController.getAllMatchesByTeam(req, res));

export default leaderBoardRoute;
