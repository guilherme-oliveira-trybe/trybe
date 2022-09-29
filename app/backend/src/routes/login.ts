import { Router } from 'express';
import LoginController from '../controllers/login';
import loginValidation from '../middlewares/loginValidation';
import auth, { NewRequest } from '../middlewares/auth';

// export default class LoginRoute {
//   private _loginController = new LoginController();
//   private _loginRouter = Router();

//   public login() {
//     this._loginRouter.post('/', this._loginController.login);
//   }
// }

const loginController = new LoginController();
const loginRoute = Router();

loginRoute.post('/', loginValidation, (req, res) => loginController.login(req, res));
loginRoute.get(
  '/validate',
  (req, res, next) => auth.verify(req as NewRequest, res, next),
  (req, res) => loginController.userType(req as NewRequest, res),
);

export default loginRoute;
