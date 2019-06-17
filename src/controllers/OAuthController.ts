import OAuthClient from '../entities/OAuthClient';
import User from '../entities/User';
import { getManager } from 'typeorm';
import randomBytes from '../utils/randomBytes';

export default class OAuthController {
  public static async registerClient(
    opts: OAuthClientRegistration
  ): Promise<{ id: string; secret: string }> {
    const id = await OAuthController.generateId();

    const secretBuffer = await randomBytes(32);
    const secret = secretBuffer.toString('hex');

    const client = getManager().create(OAuthClient, {
      applicationName: opts.applicationName,
      description: opts.description,
      id,
      secret,
      redirectUris: opts.redirectUris,
      registrant: opts.user,
      website: opts.website
    });

    await getManager().save(client);

    return {
      id,
      secret
    };
  }

  private static async generateId(): Promise<string> {
    let id: string;

    do {
      const buff = await randomBytes(8);
      id = buff.toString('hex');
    } while (
      await getManager()
        .getRepository(OAuthClient)
        .findOne(id)
    );

    return id;
  }
}

export interface OAuthClientRegistration {
  applicationName: string;
  description: string;
  redirectUris: string[];
  user: User;
  website: string;
}
