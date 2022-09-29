import * as bcrypt from 'bcryptjs';
import tokenHelper from '../helpers/tokenHelper';
import Users from '../database/models/User';
import CustomError from '../errors/CustomError';

export default class LoginService {
  private _userModel = Users;

  public async login(email: string, password: string) {
    const user = await this._userModel.findOne({ where: { email } });
    if (!user) throw new CustomError(404, 'User not found');

    const comparePassword = bcrypt.compare(user.password, password);
    if (!comparePassword) throw new CustomError(400, 'Unauthorized user');

    const token = tokenHelper.createToken({ email });

    return { token };
  }
}
