import { decrypt, encrypt } from '../utils/encryption';
import Budget from '../entities/Budget';
import BudgetController from './BudgetController';
import HttpError from '../utils/HttpError';
import Session from '../entities/Session';
import User from '../entities/User';
import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import randomBytes from '../utils/randomBytes';

export interface SessionTokens {
  accessToken: {
    key: string;
    cookie: string;
  };
  refreshToken: {
    key: string;
    cookie: string;
  };
  expiresIn: number;
}

export default class UserController {
  private static encryptionKey = process.env.ACCESS_TOKEN_ENCRYPTION as string;

  private static tokenExpiration = 3600;

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
  ): Promise<SessionTokens> {
    const user = await getManager().findOne(User, {
      where: { email },
      select: ['hash', 'id']
    });

    if (!user) {
      throw new HttpError({
        error: 'invalid_request',
        message: `Email isn't registered.`,
        statusCode: 401
      });
    }

    const passMatch = await bcrypt.compare(password, user.hash);

    if (!passMatch) {
      throw new HttpError({
        error: 'invalid_request',
        message: 'Password is incorrect',
        statusCode: 401
      });
    }

    const refreshSecret = (await randomBytes(32)).toString('hex');

    const session = getManager().create(Session, {
      user,
      refreshSecretHash: await bcrypt.hash(refreshSecret, 10)
    });

    await getManager().save(Session, session);

    return UserController.getSessionTokens(session, refreshSecret);
  }

  public static async refreshSession(
    refreshToken: string,
    cookie: string
  ): Promise<SessionTokens> {
    let id: string;
    let secret: string;

    try {
      const json = decrypt(refreshToken, cookie, UserController.encryptionKey);
      [id, secret] = JSON.parse(json);
    } catch (e) {
      throw new HttpError({
        error: 'invalid_token',
        message: 'Invalid refresh token.',
        statusCode: 401
      });
    }

    const session = await getManager()
      .createQueryBuilder(Session, 'session')
      .addSelect('session.refreshSecretHash')
      .where('session.id = :id', { id })
      .getOne();

    if (!session) {
      throw new HttpError({
        error: 'invalid_token',
        message: 'Invalid refresh token.',
        statusCode: 401
      });
    }

    const hashMatch = bcrypt.compare(secret, session.refreshSecretHash);

    if (!hashMatch) {
      throw new HttpError({
        error: 'invalid_token',
        message: 'Invalid refresh token.',
        statusCode: 401
      });
    }

    const newRefreshSecret = (await randomBytes(32)).toString('hex');

    session.refreshSecretHash = await bcrypt.hash(newRefreshSecret, 10);

    await getManager().save(Session, session);

    return await UserController.getSessionTokens(session, newRefreshSecret);
  }

  public static async validateSession(
    accessToken: string,
    csrf: string
  ): Promise<{ user: User; token: Session }> {
    let id: string;
    let version: number;

    try {
      const json = decrypt(accessToken, csrf, UserController.encryptionKey);
      [id, version] = JSON.parse(json);
    } catch (e) {
      throw new HttpError({
        error: 'invalid_token',
        message: 'Invalid access token.',
        statusCode: 401
      });
    }

    const user = await getManager()
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.sessions', 'session')
      .where('session.id = :sessionId', { sessionId: id })
      .andWhere('session.version = :version', { version })
      .getOne();

    if (!user) {
      throw new HttpError({
        error: 'invalid_token',
        message: 'Invalid access token.',
        statusCode: 401
      });
    }

    const session = user.sessions[0];

    if (!session) {
      throw new Error('Could not filter session.');
    }

    delete user.sessions;

    return { user, token: session };
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

  public async removeSession(sessionId: string): Promise<void> {
    const session = await getManager()
      .createQueryBuilder(Session, 'session')
      .leftJoin('session.user', 'user')
      .where('session.id = :sessionId', { sessionId })
      .andWhere('user.id = :userId', { userId: this.user.id })
      .getOne();

    if (!session) {
      throw new Error('Session not found.');
    }

    await getManager().remove(session);
  }

  private static async getSessionTokens(
    session: Session,
    refreshSecret: string
  ): Promise<SessionTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      encrypt(
        JSON.stringify([session.id, session.version]),
        UserController.encryptionKey
      ),
      encrypt(
        JSON.stringify([session.id, refreshSecret]),
        UserController.encryptionKey
      )
    ]);

    return {
      accessToken: {
        key: accessToken.encrypted,
        cookie: accessToken.iv
      },
      refreshToken: {
        key: refreshToken.encrypted,
        cookie: refreshToken.iv
      },
      expiresIn: UserController.tokenExpiration
    };
  }
}
