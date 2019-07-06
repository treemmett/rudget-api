import Budget from '../entities/Budget';
import BudgetAllocation from '../entities/BudgetAllocation';
import BudgetCategory from '../entities/BudgetCategory';
import BudgetGroup from '../entities/BudgetGroup';
import HttpError from '../utils/HttpError';
import Transaction from '../entities/Transaction';
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

    const controller = new BudgetController(budget);

    // create default groups
    const defaultGroups = await Promise.all(
      Object.keys(BudgetController.defaultCategories).map((groupName, index) =>
        controller.createGroup(groupName, index)
      )
    );

    // create default categories
    await Promise.all(
      defaultGroups.map(async group => {
        const categoryNames = BudgetController.defaultCategories[group.name];

        await Promise.all(
          categoryNames.map((categoryName, index) =>
            controller.createCategory(categoryName, group, index)
          )
        );
      })
    );

    return budget;
  }

  public static async getBudget(budgetId: string, user: User): Promise<Budget> {
    const budget = await getManager()
      .createQueryBuilder(Budget, 'budget')
      .where('budget.id = :budgetId', { budgetId })
      .leftJoin('budget.owner', 'user')
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!budget) {
      throw new HttpError({
        description: `budget id '${budgetId}' was not found.`,
        error: 'budget_not_found',
        message: `Budget not found.`,
        statusCode: 404
      });
    }

    return budget;
  }

  public budget: Budget;

  public constructor(budget: Budget) {
    this.budget = budget;
  }

  public async addTransaction(
    description: string,
    amount: number,
    date: Date,
    category: BudgetCategory
  ): Promise<Transaction> {
    const transaction = getManager().create(Transaction, {
      description,
      date,
      amount,
      category
    });

    await getManager().save(Transaction, transaction);

    return transaction;
  }

  public async allocateFunds(
    category: BudgetCategory,
    year: number,
    month: number,
    amount: number
  ): Promise<void> {
    // check if allocation already exists
    const entity =
      (await getManager()
        .createQueryBuilder(BudgetAllocation, 'allocation')
        .leftJoin('allocation.category', 'category')
        .where('category.id = :categoryId', { categoryId: category.id })
        .andWhere('allocation.year = :year', { year })
        .andWhere('allocation.month = :month', { month })
        .getOne()) ||
      getManager().create(BudgetAllocation, {
        category,
        month,
        year
      });

    entity.amount = amount;

    await getManager().save(BudgetAllocation, entity);
  }

  public async changeCategoryPosition(
    categoryId: string,
    groupId: string,
    index: number
  ): Promise<void> {
    const [category, group] = await Promise.all([
      getManager()
        .createQueryBuilder(BudgetCategory, 'category')
        .leftJoin('category.group', 'group')
        .leftJoin('group.budget', 'budget')
        .where('budget.id = :budgetId', { budgetId: this.budget.id })
        .andWhere('category.id = :categoryId', { categoryId })
        .getOne(),
      getManager()
        .createQueryBuilder(BudgetGroup, 'group')
        .leftJoin('group.budget', 'budget')
        .leftJoinAndSelect('group.categories', 'categories')
        .where('budget.id = :budgetId', { budgetId: this.budget.id })
        .andWhere('group.id = :groupId', { groupId })
        .getOne()
    ]);

    if (!category) {
      throw new HttpError({
        description: `category id '${categoryId}' was not found.`,
        error: 'category_not_found',
        message: `Category not found.`,
        statusCode: 404
      });
    }

    if (!group) {
      throw new HttpError({
        description: `group id ${groupId} was not found.`,
        error: 'group_not_found',
        message: `Group not found.`,
        statusCode: 404
      });
    }

    group.categories.splice(index, 0, category);

    group.categories = group.categories.map((c, i) => ({ ...c, sort: i }));

    await getManager().save(BudgetGroup, group);
  }

  public async changeGroupPosition(
    groupId: string,
    index: number
  ): Promise<void> {
    const groups = await getManager()
      .createQueryBuilder(BudgetGroup, 'group')
      .leftJoin('group.budget', 'budget')
      .where('budget.id = :budgetId', { budgetId: this.budget.id })
      .getMany();

    const currentIndex = groups.findIndex(g => g.id === groupId);
    const [group] = groups.splice(currentIndex, 1);
    groups.splice(index, 0, group);

    await getManager().save(
      BudgetGroup,
      groups.map((g, i) => ({ ...g, sort: i }))
    );
  }

  public async createCategory(
    name: string,
    group: BudgetGroup,
    sort?: number
  ): Promise<BudgetCategory> {
    const countFn =
      '(SELECT COUNT(id) FROM budget_categories WHERE "groupId" = :groupId)';
    const result = await getManager()
      .createQueryBuilder()
      .insert()
      .into(BudgetCategory)
      .values({
        name,
        group,
        sort: sort === undefined ? () => countFn : sort
      })
      .setParameter('groupId', group.id)
      .execute();

    const { id } = result.identifiers[0];

    const category = await getManager().findOneOrFail(BudgetCategory, id);

    return category;
  }

  public async createGroup(name: string, sort?: number): Promise<BudgetGroup> {
    const countFn =
      '(SELECT COUNT(id) FROM budget_groups WHERE "budgetId" = :budgetId)';

    const result = await getManager()
      .createQueryBuilder()
      .insert()
      .into(BudgetGroup)
      .values({
        name,
        budget: this.budget,
        sort: sort === undefined ? () => countFn : sort
      })
      .setParameter('budgetId', this.budget.id)
      .execute();

    const { id } = result.identifiers[0];

    const group = await getManager().findOneOrFail(BudgetGroup, id);

    return group;
  }

  public async displayBudget(): Promise<Budget> {
    const curDate = new Date();

    const budget = await getManager()
      .createQueryBuilder(Budget, 'budget')
      .leftJoinAndSelect('budget.groups', 'groups')
      .leftJoinAndSelect('groups.categories', 'categories')
      .leftJoinAndMapOne(
        'categories.allocation',
        'categories.allocations',
        'allocations',
        'allocations.month = :month AND allocations.year = :year'
      )
      .where('budget.id = :budgetId', { budgetId: this.budget.id })
      .setParameters({ month: curDate.getMonth(), year: curDate.getFullYear() })
      .getOne();

    if (!budget) {
      throw new HttpError({
        error: 'budget_not_found',
        message: 'Budget not found',
        statusCode: 404
      });
    }

    const b = {
      ...budget,
      groups: budget.groups.map(group => ({
        ...group,
        categories: group.categories.map(c => {
          const category = { ...c };
          // @ts-ignore
          category.amount = '0.00';

          // @ts-ignore
          if (category.allocation) {
            // @ts-ignore
            category.amount = category.allocation.amount;
          }

          // @ts-ignore
          delete category.allocation;

          return category;
        })
      }))
    };

    return b;
  }

  public async getCategory(categoryId: string): Promise<BudgetCategory> {
    try {
      const entity = await getManager()
        .createQueryBuilder(BudgetCategory, 'category')
        .leftJoin('category.group', 'group')
        .leftJoin('group.budget', 'budget')
        .where('budget.id = :budgetId', { budgetId: this.budget.id })
        .andWhere('category.id = :categoryId', { categoryId })
        .getOne();

      if (!entity) {
        throw {};
      }

      return entity;
    } catch (e) {
      throw new HttpError({
        description: `category id '${categoryId}' was not found.`,
        error: 'category_not_found',
        message: `Category not found.`,
        statusCode: 404
      });
    }
  }

  public async getGroup(groupId: string): Promise<BudgetGroup> {
    try {
      const entity = await getManager()
        .createQueryBuilder(BudgetGroup, 'group')
        .leftJoin('group.budget', 'budget')
        .where('budget.id = :budgetId', { budgetId: this.budget.id })
        .andWhere('group.id = :groupId', { groupId })
        .getOne();

      if (!entity) {
        throw {};
      }

      return entity;
    } catch (e) {
      throw new HttpError({
        description: `group id '${groupId}' was not found.`,
        error: 'group_not_found',
        message: `Group not found.`,
        statusCode: 404
      });
    }
  }

  public getTransactions(): Promise<Transaction[]> {
    return getManager()
      .createQueryBuilder(Transaction, 'transaction')
      .leftJoin('transaction.category', 'category')
      .leftJoin('category.group', 'group')
      .leftJoin('group.budget', 'budget')
      .where('budget.id = :budgetId', { budgetId: this.budget.id })
      .getMany();
  }
}
