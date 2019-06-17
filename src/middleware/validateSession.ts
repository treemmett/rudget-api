import { RequestHandler } from 'express';
import User from '../entities/User';
import UserController from '../controllers/UserController';

const validateSession = (): RequestHandler => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Missing access token');
    }

    const accessToken = req.headers.authorization.split('Bearer ');
    const user: User = await UserController.validateSession(
      accessToken[1],
      req.cookies.csrf
    );

    req.session = {
      user
    };

    next();
  } catch (e) {
    next(e);
  }
};

export default validateSession;

declare global {
  namespace Express {
    interface Request {
      session: {
        user: User;
      };
    }
  }
}
