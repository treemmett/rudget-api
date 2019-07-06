import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import BudgetCategory from './BudgetCategory';

@Entity({ name: 'transactions ' })
export default class Transaction {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public description: string;

  @Column({
    type: 'decimal',
    precision: 13,
    scale: 2,
    transformer: { from: value => Number(value), to: value => Number(value) }
  })
  public amount: number;

  @Column({ type: 'date' })
  public date: Date;

  @ManyToOne(() => BudgetCategory, category => category.transactions, {
    onDelete: 'CASCADE',
    nullable: false
  })
  public category: BudgetCategory;

  @Column({ nullable: false })
  public categoryId: string;
}
