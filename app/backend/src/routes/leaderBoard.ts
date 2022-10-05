import { Router } from 'express';
import LeaderBoardController from '../controllers/leaderBoard';

const leaderBoardController = new LeaderBoardController();
const leaderBoardRoute = Router();

leaderBoardRoute.get('/home', (req, res) => leaderBoardController.getLeaderBoardHome(req, res));
leaderBoardRoute.get('/away', (req, res) => leaderBoardController.getLeaderBoardAway(req, res));
leaderBoardRoute.get('/', (req, res) => leaderBoardController.getLeaderBoard(req, res));

export default leaderBoardRoute;
