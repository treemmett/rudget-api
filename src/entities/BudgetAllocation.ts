import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { IsInt, Max, Min } from 'class-validator';
import BudgetCategory from './BudgetCategory';

@Index(['year', 'month', 'category'], { unique: true })
@Entity({ name: 'budget_allocation' })
export default class BudgetAllocation {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'smallint' })
  @IsInt()
  @Min(2018)
  @Max(2099)
  public year: number;

  @Column({ type: 'smallint' })
  @IsInt()
  @Min(0)
  @Max(11)
  public month: number;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2,
    transformer: { from: value => Number(value), to: value => Number(value) }
  })
  public amount: number;

  @ManyToOne(() => BudgetCategory, category => category.allocations, {
    onDelete: 'CASCADE',
    nullable: false
  })
  public category: BudgetCategory;
}
