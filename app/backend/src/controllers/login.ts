import { Request, Response } from 'express';
import { NewRequest } from '../middlewares/auth';
import LoginService from '../services/login';

interface UserEmail {
  email: string;
}

interface LoginBody extends UserEmail{
  password: string;
}

export default class LoginController {
  private _loginService = new LoginService();

  public async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginBody;

    const result = await this._loginService.login(email, password);

    return res.status(200).json(result);
  }

  public async userType(req: NewRequest, res: Response) {
    const email = req.userEmail;

    const result = await this._loginService.userType(email);

    return res.status(200).json(result);
  }
}
