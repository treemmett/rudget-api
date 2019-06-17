import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import User from './User';

@Entity({ name: 'oauth_clients' })
export default class OAuthClient {
  @PrimaryColumn()
  public id: string;

  @Column({ nullable: false })
  public secret: string;

  @Column({ nullable: false })
  public applicationName: string;

  @Column({ nullable: false })
  public description: string;

  @Column({ nullable: false })
  public website: string;

  @Column('simple-array')
  public redirectUris: string[];

  @ManyToOne(() => User)
  public registrant: User;
}
