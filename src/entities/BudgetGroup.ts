import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Budget from './Budget';

@Entity({ name: 'budget_groups ' })
export default class BudgetGroup {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @ManyToOne(() => Budget, budget => budget.groups, { onDelete: 'CASCADE' })
  public budget: Budget;
}
