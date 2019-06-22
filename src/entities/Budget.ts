import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import BudgetGroup from './BudgetGroup';
import User from './User';

@Entity({ name: 'budgets' })
export default class Budget {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: false })
  public name: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  public owner: User;

  @OneToMany(() => BudgetGroup, group => group.budget, { eager: true })
  public groups: BudgetGroup[];
}
