import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryManDelivery from './app/controllers/DeliveryManDelivery';
import PickUpDelivery from './app/controllers/PickUpDelivery';
import EndDelivery from './app/controllers/EndDelivery';

import AuthMiddleware from './app/middlewares/auth';
/**
 * Validation Middlewares
 */
import RecipientValidationMiddleware from './app/middlewares/validation/recipient/recipientValidation';
import DeliveryManValidationMiddleware from './app/middlewares/validation/deliveryMan/deliveryManValidation';
import DeliveryManActiveValidation from './app/middlewares/validation/deliveryMan/DeliveryManActiveValidation';
import DeliveryValidationMiddleware from './app/middlewares/validation/delivery/deliveryValidation';
import DeliveryExistsValidationMiddleware from './app/middlewares/validation/delivery/deliveryExistsValidation';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.get('/deliveryman/:id/delivery/:status',DeliveryManActiveValidation, DeliveryManDelivery.index);
routes.post('/deliveryman/:id/pickupdelivery/:deliveryid',DeliveryManActiveValidation, PickUpDelivery.store);
routes.post('/deliveryman/:id/enddelivery/:deliveryid',DeliveryManActiveValidation, EndDelivery.store);
//routes.put('/deliveryman/:id/delivery/:deliveryId/deliver', DeliveryManDelivery.update);

routes.use(AuthMiddleware);//Routes that need authentication after this line
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientValidationMiddleware, RecipientController.store);
routes.put('/recipients/:id', RecipientValidationMiddleware, RecipientController.update);

routes.get('/deliverymen', DeliveryManController.index);
routes.post('/deliverymen', DeliveryManValidationMiddleware, DeliveryManController.store);
routes.put('/deliverymen/:id', DeliveryManActiveValidation, DeliveryManValidationMiddleware, DeliveryManController.update);
routes.delete('/deliverymen/:id',DeliveryManActiveValidation, DeliveryManController.delete);

routes.post('/deliveries', DeliveryValidationMiddleware, DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.put('/deliveries/:id', DeliveryExistsValidationMiddleware, DeliveryValidationMiddleware, DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryExistsValidationMiddleware, DeliveryController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
