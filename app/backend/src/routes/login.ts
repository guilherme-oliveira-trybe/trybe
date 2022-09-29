import { Router } from 'express';
import LoginController from '../controllers/login';

// export default class LoginRoute {
//   private _loginController = new LoginController();
//   private _loginRouter = Router();

//   public login() {
//     this._loginRouter.post('/', this._loginController.login);
//   }
// }

const loginController = new LoginController();
const loginRoute = Router();

loginRoute.post('/', (req, res) => loginController.login(req, res));

export default loginRoute;
