import * as JWT from 'jsonwebtoken';
import 'dotenv/config';
import CustomError from '../errors/CustomError';

const { JWT_SECRET } = process.env;
const JWT_CONFIG: object = { algorithm: 'HS256', expiresIn: '1d' };

const tokenHelper = {
  createToken: (payload: object) => {
    const token = JWT.sign(payload, JWT_SECRET as string, JWT_CONFIG);
    return token;
  },
  verifyToken: (payload: string) => {
    try {
      const dados = JWT.verify(payload, JWT_SECRET as string);
      return dados;
    } catch (error) {
      if (error) throw new CustomError(401, 'Token must be a valid token');
    }
  },
};

export default tokenHelper;
