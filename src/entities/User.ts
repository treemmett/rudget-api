import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Session from './Session';

@Entity({ name: 'users' })
export default class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({ unique: true })
  @Column({ nullable: false })
  public email: string;

  @Column({ nullable: false })
  public firstName: string;

  @Column({ nullable: false })
  public lastName: string;

  @Column({ nullable: false, select: false })
  public hash: string;

  @CreateDateColumn()
  public created: Date;

  @OneToMany(() => Session, session => session.user)
  public sessions: Session[];
}
