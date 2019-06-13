import { Router } from 'express';
import UserController from '../controllers/UserController';

const user = Router();

user.post('/', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    await UserController.createUser(email, password, firstName, lastName);
    res.status(201).end();
  } catch (e) {
    next(e);
  }
});

export default user;
