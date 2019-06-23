import { Joi, celebrate } from 'celebrate';
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

budgets.put(
  '/:budgetId/categories/:categoryId/:year/:month',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      amount: Joi.number().precision(2)
    }),
    params: {
      budgetId: Joi.string(),
      categoryId: Joi.string(),
      year: Joi.number()
        .integer()
        .min(2018)
        .max(2099),
      month: Joi.number()
        .integer()
        .min(0)
        .max(11)
    }
  }),
  async (req, res, next) => {
    try {
      const { budgetId, categoryId, year, month } = req.params;

      const budget = await BudgetController.getBudget(budgetId);
      const controller = new BudgetController(budget, req.session.user);
      const category = await controller.getCategory(categoryId);
      await controller.allocateFunds(category, year, month, req.body.amount);
      res.end();
    } catch (e) {
      next(e);
    }
  }
);

export default budgets;
