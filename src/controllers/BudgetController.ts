import Budget from '../entities/Budget';
import User from '../entities/User';
import { getManager } from 'typeorm';

export default class BudgetController {
  public static async createBudget(name: string, owner: User): Promise<Budget> {
    const budget = getManager().create(Budget, {
      name,
      owner
    });

    await getManager().save(Budget, budget);

    return budget;
  }
}
