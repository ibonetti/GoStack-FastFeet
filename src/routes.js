import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';

import AuthMiddleware from './app/middlewares/auth';
/**
 * Validation Middlewares
 */
import RecipientValidationMiddleware from './app/middlewares/validation/recipientValidation';
import DeliveryManValidationMiddleware from './app/middlewares/validation/deliveryManValidation';
import DeliveryManActiveValidation from './app/middlewares/validation/DeliveryManActiveValidation';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);//Routes that need authentication after this line
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientValidationMiddleware, RecipientController.store);
routes.put('/recipients/:id', RecipientValidationMiddleware, RecipientController.update);

routes.get('/deliverymen', DeliveryManController.index);
routes.post('/deliverymen', DeliveryManValidationMiddleware, DeliveryManController.store);
routes.put('/deliverymen/:id', DeliveryManActiveValidation, DeliveryManValidationMiddleware, DeliveryManController.update);
routes.delete('/deliverymen/:id',DeliveryManActiveValidation, DeliveryManController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
