import OAuthController from '../controllers/OAuthController';
import { Router } from 'express';
import validateSession from '../middleware/validateSession';

const oauth = Router();

oauth.post('/clients', validateSession(), async (req, res, next) => {
  try {
    const { applicationName, description, redirectUris, website } = req.body;
    const clientDetails = await OAuthController.registerClient({
      applicationName,
      description,
      redirectUris,
      website,
      user: req.session.user
    });

    res.status(201).send(clientDetails);
  } catch (e) {
    next(e);
  }
});

export default oauth;
