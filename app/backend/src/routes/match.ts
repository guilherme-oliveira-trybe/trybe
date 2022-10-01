import { Router } from 'express';
import auth, { NewRequest } from '../middlewares/auth';
import MatchController from '../controllers/match';

const matchController = new MatchController();
const matchRoute = Router();

matchRoute.get('/', (req, res) => matchController.getAll(req, res));
matchRoute.patch('/:id/finish', (req, res) => matchController.updateMatchProgress(req, res));
matchRoute.post(
  '/',
  (req, res, next) => auth.verify(req as NewRequest, res, next),
  (req, res) => matchController.create(req, res),
);

export default matchRoute;
