import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import authMiddleware from './app/middlewares/auth';
import recipientMiddleware from './app/middlewares/recipientStore';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);//Routes that need authentication after this line
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', recipientMiddleware, RecipientController.store);
routes.put('/recipients/:id', recipientMiddleware, RecipientController.update);

export default routes;
