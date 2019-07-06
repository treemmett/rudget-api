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
    const budget = await BudgetController.getBudget(
      req.params.budgetId,
      req.session.user
    );
    const controller = new BudgetController(budget);
    const renderedBudget = await controller.displayBudget();
    res.send(renderedBudget);
  } catch (e) {
    next(e);
  }
});

budgets.patch(
  '/:budgetId/categories/:categoryId',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      group: Joi.string().required(),
      index: Joi.number()
        .integer()
        .required()
    })
  }),
  async (req, res, next) => {
    try {
      const { budgetId, categoryId } = req.params;
      const { group, index } = req.body;
      const budget = await BudgetController.getBudget(
        budgetId,
        req.session.user
      );
      const controller = new BudgetController(budget);
      await controller.changeCategoryPosition(categoryId, group, index);
      res.end();
    } catch (e) {
      next(e);
    }
  }
);

budgets.post(
  '/:budgetId/categories/:categoryId/transactions',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      amount: Joi.number()
        .precision(2)
        .required(),
      date: Joi.date().required(),
      description: Joi.string()
        .trim()
        .required()
    })
  }),
  async (req, res, next) => {
    try {
      const { budgetId, categoryId } = req.params;
      const { amount, date, description } = req.body;
      const budget = await BudgetController.getBudget(
        budgetId,
        req.session.user
      );
      const controller = await new BudgetController(budget);
      const category = await controller.getCategory(categoryId);
      const transaction = await controller.addTransaction(
        description,
        amount,
        date,
        category
      );
      res.send(transaction);
    } catch (e) {
      next(e);
    }
  }
);

budgets.put(
  '/:budgetId/categories/:categoryId/:year/:month',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      amount: Joi.number()
        .precision(2)
        .required()
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

      const budget = await BudgetController.getBudget(
        budgetId,
        req.session.user
      );
      const controller = new BudgetController(budget);
      const category = await controller.getCategory(categoryId);
      await controller.allocateFunds(category, year, month, req.body.amount);
      res.end();
    } catch (e) {
      next(e);
    }
  }
);

budgets.patch(
  '/:budgetId/groups/:groupId',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      index: Joi.number()
        .integer()
        .required()
    })
  }),
  async (req, res, next) => {
    try {
      const { budgetId, groupId } = req.params;
      const { index } = req.body;
      const budget = await BudgetController.getBudget(
        budgetId,
        req.session.user
      );
      const controller = new BudgetController(budget);
      await controller.changeGroupPosition(groupId, index);
      res.end();
    } catch (e) {
      next(e);
    }
  }
);

budgets.post(
  '/:budgetId/groups/:groupId/category',
  validateSession(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string()
        .trim()
        .required()
    })
  }),
  async (req, res, next) => {
    try {
      const { budgetId, groupId } = req.params;
      const budget = await BudgetController.getBudget(
        budgetId,
        req.session.user
      );
      const controller = new BudgetController(budget);
      const group = await controller.getGroup(groupId);
      const category = await controller.createCategory(req.body.name, group);
      res.send(category);
    } catch (e) {
      next(e);
    }
  }
);

budgets.get(
  '/:budgetId/transactions',
  validateSession(),
  async (req, res, next) => {
    try {
      const budget = await BudgetController.getBudget(
        req.params.budgetId,
        req.session.user
      );
      const controller = new BudgetController(budget);
      const transactions = await controller.getTransactions();
      res.send(transactions);
    } catch (e) {
      next(e);
    }
  }
);

export default budgets;
