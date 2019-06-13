import User from '../entities/User';
import bcrypt from 'bcrypt';
import { getManager } from 'typeorm';

export default class UserController {
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
}
