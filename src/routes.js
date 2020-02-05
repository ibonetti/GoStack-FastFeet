import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';

import authMiddleware from './app/middlewares/auth';
import recipientMiddleware from './app/middlewares/recipientStore';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);//Routes that need authentication after this line
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', recipientMiddleware, RecipientController.store);
routes.put('/recipients/:id', recipientMiddleware, RecipientController.update);

routes.get('/deliverymen', DeliveryManController.index);
routes.post('/deliverymen', DeliveryManController.store);
routes.delete('/deliverymen/:id', DeliveryManController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
