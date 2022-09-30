import { Router } from 'express';
import MatchController from '../controllers/match';

const matchController = new MatchController();
const matchRoute = Router();

matchRoute.get('/', (req, res) => matchController.getAll(req, res));

export default matchRoute;
