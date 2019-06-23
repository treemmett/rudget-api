import BudgetController from '../controllers/BudgetController';
import { Router } from 'express';
import UserController from '../controllers/UserController';
import validateSession from '../middleware/validateSession';

const budgets = Router();

budgets.get('/', validateSession(), async (req, res, next) => {
  try {
    const userController = new UserController(req.session.user);
    const b = await userController.getBudgets();
    res.send(b);
  } catch (e) {
    next(e);
  }
});

budgets.get('/:budgetId', validateSession(), async (req, res, next) => {
  try {
    const budget = await BudgetController.getBudget(req.params.budgetId);
    const controller = new BudgetController(budget, req.session.user);
    delete controller.budget.owner;
    res.send(controller.budget);
  } catch (e) {
    next(e);
  }
});

export default budgets;
