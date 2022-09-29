import { Request, Response, NextFunction } from 'express';
import tokenHelper from '../helpers/tokenHelper';
import CustomError from '../errors/CustomError';

type TokenVerify = {
  email: string;
};

export type NewRequest = {
  userEmail: string;
} & Request;

const auth = {
  verify: async (req: NewRequest, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) throw new CustomError(401, 'Token not found');

    const { email } = tokenHelper.verifyToken(authorization) as TokenVerify;
    req.userEmail = email;

    next();
  },
};

export default auth;
