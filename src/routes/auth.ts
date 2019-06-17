import { Router } from 'express';
import UserController from '../controllers/UserController';
import validateSession from '../middleware/validateSession';

const user = Router();

user.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const session = await UserController.login(email, password);

    res
      .cookie('csrf', session.csrf, {
        expires: new Date(Date.now() + 2592000000),
        httpOnly: true,
        sameSite: true
      })
      .send({
        accessToken: session.accessToken
      });
  } catch (e) {
    next(e);
  }
});

user.get('/', validateSession(), (req, res) => res.send(req.session));

export default user;