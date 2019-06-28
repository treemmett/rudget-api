import { RequestHandler } from 'express';
import Session from '../entities/Session';
import User from '../entities/User';
import UserController from '../controllers/UserController';

const validateSession = (): RequestHandler => async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Missing access token');
    }

    const accessToken = req.headers.authorization.split('Bearer ');
    const {
      user,
      token
    }: { user: User; token: Session } = await UserController.validateSession(
      accessToken[1],
      req.cookies.s
    );

    req.session = {
      user,
      token
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
        token: Session;
        user: User;
      };
    }
  }
}
