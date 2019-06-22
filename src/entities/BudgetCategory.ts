import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BudgetGroup from './BudgetGroup';

@Entity({ name: 'budget_categories' })
export default class BudgetCategory {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @ManyToOne(() => BudgetGroup, group => group.categories, {
    onDelete: 'CASCADE',
    nullable: false
  })
  public group: BudgetGroup;
}
