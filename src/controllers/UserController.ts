import Session from '../entities/Session';
import User from '../entities/User';
import bcrypt from 'bcrypt';
import { encrypt } from '../utils/encryption';
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
}
