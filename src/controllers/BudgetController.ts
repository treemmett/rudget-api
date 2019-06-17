import Budget from '../entities/Budget';
import BudgetGroup from '../entities/BudgetGroup';
import User from '../entities/User';
import { getManager } from 'typeorm';

export default class BudgetController {
  private static defaultCategories = [
    'Housing',
    'Transportation',
    'Food',
    'Personal Care',
    'Quality of Life'
  ];

  public static async createBudget(name: string, owner: User): Promise<Budget> {
    const budget = getManager().create(Budget, {
      name,
      owner
    });

    await getManager().save(Budget, budget);

    const controller = new BudgetController(budget, owner);

    await Promise.all(
      BudgetController.defaultCategories.map(async groupName => {
        await controller.createGroup(groupName);
      })
    );

    return budget;
  }

  public static async getBudget(budgetId: string): Promise<Budget> {
    try {
      return await getManager().findOneOrFail(Budget, budgetId);
    } catch (e) {
      throw new Error('Budget not found.');
    }
  }

  public budget: Budget;

  public constructor(budget: Budget, owner: User) {
    if (budget.owner.id === owner.id) {
      this.budget = budget;
    } else {
      throw new Error('You do not have permission to access this budget.');
    }
  }

  public async createGroup(name: string): Promise<BudgetGroup> {
    const group = getManager().create(BudgetGroup, {
      name,
      budget: this.budget
    });

    await getManager().save(BudgetGroup, group);

    return group;
  }
}
