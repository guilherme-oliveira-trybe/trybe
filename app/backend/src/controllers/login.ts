import { Request, Response } from 'express';
import LoginService from '../services/login';

interface LoginBody {
  email: string;
  password: string;
}

export default class LoginController {
  private _loginService = new LoginService();

  public async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginBody;

    const result = await this._loginService.login(email, password);

    return res.status(200).json(result);
  }
}
