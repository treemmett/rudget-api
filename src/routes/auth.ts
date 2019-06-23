import { Joi, celebrate } from 'celebrate';
import { Router } from 'express';
import UserController from '../controllers/UserController';

const auth = Router();

auth.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const session = await UserController.login(email, password);

    res
      .cookie('s', session.accessToken.cookie, {
        expires: new Date(Date.now() + session.expiresIn * 1000),
        httpOnly: true,
        sameSite: true
      })
      .cookie('r', session.refreshToken.cookie, {
        expires: new Date(2147483647000),
        httpOnly: true,
        sameSite: true,
        path: '/api/auth'
      });

    // add dev refresh token
    if (process.env.NODE_ENV === 'development') {
      res.cookie('r', session.refreshToken.cookie, {
        expires: new Date(2147483647000),
        httpOnly: true,
        sameSite: true,
        path: '/auth'
      });
    }

    res.send({
      accessToken: session.accessToken.key,
      refreshToken: session.refreshToken.key,
      expiresIn: session.expiresIn
    });
  } catch (e) {
    next(e);
  }
});

auth.patch(
  '/',
  celebrate({
    body: Joi.object().keys({ refreshToken: Joi.string().required() })
  }),
  async (req, res, next) => {
    try {
      const session = await UserController.refreshSession(
        req.body.refreshToken,
        req.cookies.r
      );

      res
        .cookie('s', session.accessToken.cookie, {
          expires: new Date(Date.now() + session.expiresIn * 1000),
          httpOnly: true,
          sameSite: true
        })
        .cookie('r', session.refreshToken.cookie, {
          expires: new Date(2147483647000),
          httpOnly: true,
          sameSite: true,
          path: '/api/auth'
        });

      // add dev refresh token
      if (process.env.NODE_ENV === 'development') {
        res.cookie('r', session.refreshToken.cookie, {
          expires: new Date(2147483647000),
          httpOnly: true,
          sameSite: true,
          path: '/auth'
        });
      }

      res.send({
        accessToken: session.accessToken.key,
        refreshToken: session.refreshToken.key,
        expiresIn: session.expiresIn
      });
    } catch (e) {
      next(e);
    }
  }
);

export default auth;
