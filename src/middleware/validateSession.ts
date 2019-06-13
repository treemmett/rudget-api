import { RequestHandler } from 'express';
import User from '../entities/User';
import UserController from '../controllers/UserController';

const validateSession = (): RequestHandler => async (req, res, next) => {
  try {
    const user: User = await UserController.validateSession(
      req.body.accessToken,
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
