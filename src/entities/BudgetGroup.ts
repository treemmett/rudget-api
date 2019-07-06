import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Budget from './Budget';
import BudgetCategory from './BudgetCategory';

@Entity({ name: 'budget_groups ' })
export default class BudgetGroup {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column({ nullable: false })
  public sort: number;

  @OneToMany(() => BudgetCategory, category => category.group, {
    cascade: true
  })
  public categories: BudgetCategory[];

  @ManyToOne(() => Budget, budget => budget.groups, {
    onDelete: 'CASCADE',
    nullable: false
  })
  public budget: Budget;
}
