import { Router } from 'express';
import TeamController from '../controllers/team';

const teamController = new TeamController();
const teamRoute = Router();

teamRoute.get('/', (req, res) => teamController.getAll(req, res));
teamRoute.get('/:id', (req, res) => teamController.getById(req, res));

export default teamRoute;
