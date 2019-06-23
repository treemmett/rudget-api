import { decrypt, encrypt } from '../utils/encryption';
import Budget from '../entities/Budget';
import BudgetController from './BudgetController';
import Session from '../entities/Session';
import User from '../entities/User';
import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';

export default class UserController {
  private static encryptionKey = process.env.ACCESS_TOKEN_ENCRYPTION as string;

  public static async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    const user = getManager().create(User, {
      email,
      firstName,
      lastName,
      hash: await bcrypt.hash(password, 10)
    });

    await getManager().save(user);

    // create initial budget
    await BudgetController.createBudget(`${firstName}'s Budget`, user);

    return user;
  }

  public static async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; csrf: string }> {
    const user = await getManager().findOneOrFail(User, {
      where: { email },
      select: ['hash', 'id']
    });

    const passMatch = await bcrypt.compare(password, user.hash);

    if (!passMatch) {
      throw new Error('Password is incorrect.');
    }

    const session = getManager().create(Session, {
      user
    });

    await getManager().save(Session, session);

    const { iv, encrypted } = await encrypt(
      JSON.stringify({ id: session.id, version: session.version }),
      UserController.encryptionKey
    );

    return {
      accessToken: encrypted,
      csrf: iv
    };
  }

  public static async validateSession(
    accessToken: string,
    csrf: string
  ): Promise<User> {
    const decrypted = decrypt(accessToken, csrf, UserController.encryptionKey);
    const { id, version } = JSON.parse(decrypted);

    const user = await getManager()
      .createQueryBuilder(User, 'user')
      .leftJoin('user.sessions', 'session')
      .where('session.id = :sessionId', { sessionId: id })
      .andWhere('session.version = :version', { version })
      .getOne();

    if (!user) {
      throw new Error('Session not found.');
    }

    return user;
  }

  public user: User;

  public constructor(user: User) {
    this.user = user;
  }

  public getBudgets(): Promise<Budget[]> {
    return getManager()
      .createQueryBuilder(Budget, 'budget')
      .leftJoin('budget.owner', 'user')
      .where('user.id = :userId', { userId: this.user.id })
      .getMany();
  }
}
