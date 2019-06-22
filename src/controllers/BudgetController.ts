import Budget from '../entities/Budget';
import BudgetCategory from '../entities/BudgetCategory';
import BudgetGroup from '../entities/BudgetGroup';
import User from '../entities/User';
import { getManager } from 'typeorm';

export default class BudgetController {
  private static defaultCategories: { [key: string]: string[] } = {
    Housing: ['Rent', 'Gas', 'Electric', 'Internet'],
    Transportation: [
      'Auto Loan',
      'Fuel',
      'Insurance',
      'Maintenance',
      'Public Transportation'
    ],
    Food: ['Groceries', 'Dining', 'Snacks'],
    'Personal Care': ['Medical', 'Haircut'],
    'Quality of Life': ['Subscriptions', 'Entertainment', 'Phone']
  };

  public static async createBudget(name: string, owner: User): Promise<Budget> {
    const budget = getManager().create(Budget, {
      name,
      owner
    });

    await getManager().save(Budget, budget);

    const controller = new BudgetController(budget, owner);

    // create default groups
    const defaultGroups = await Promise.all(
      Object.keys(BudgetController.defaultCategories).map(
        controller.createGroup,
        controller
      )
    );

    // create default categories
    await Promise.all(
      defaultGroups.map(async group => {
        const categoryNames = BudgetController.defaultCategories[group.name];

        await Promise.all(
          categoryNames.map(categoryName =>
            controller.createCategory(categoryName, group)
          )
        );
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

  public async createCategory(
    name: string,
    group: BudgetGroup
  ): Promise<BudgetCategory> {
    const category = getManager().create(BudgetCategory, {
      name,
      group
    });

    await getManager().save(BudgetCategory, category);

    return category;
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
