import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliveryManController from './app/controllers/DeliveryManController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryManDelivery from './app/controllers/DeliveryManDelivery';
import PickUpDeliveryController from './app/controllers/PickUpDeliveryController ';
import EndDeliveryController from './app/controllers/EndDeliveryController ';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryWithProblemController from './app/controllers/DeliveryWithProblemController';

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
routes.post('/deliveryman/:id/pickupdelivery/:deliveryid',DeliveryManActiveValidation, PickUpDeliveryController .store);
routes.post('/deliveryman/:id/enddelivery/:deliveryid',DeliveryManActiveValidation, EndDeliveryController .store);
routes.post('/delivery/:id/problems',DeliveryExistsValidationMiddleware, DeliveryProblemController.store);
routes.get('/delivery/:id/problems',DeliveryExistsValidationMiddleware, DeliveryProblemController.index);
//routes.put('/deliveryman/:id/delivery/:deliveryId/deliver', DeliveryManDelivery.update);

routes.use(AuthMiddleware);//Routes that need authentication after this line
routes.get('/recipient', RecipientController.index);
routes.post('/recipient', RecipientValidationMiddleware, RecipientController.store);
routes.put('/recipient/:id', RecipientValidationMiddleware, RecipientController.update);

routes.get('/deliveryman', DeliveryManController.index);
routes.post('/deliveryman', DeliveryManValidationMiddleware, DeliveryManController.store);
routes.put('/deliveryman/:id', DeliveryManActiveValidation, DeliveryManValidationMiddleware, DeliveryManController.update);
routes.delete('/deliveryman/:id',DeliveryManActiveValidation, DeliveryManController.delete);

routes.post('/delivery', DeliveryValidationMiddleware, DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', DeliveryExistsValidationMiddleware, DeliveryValidationMiddleware, DeliveryController.update);
routes.delete('/delivery/:id', DeliveryExistsValidationMiddleware, DeliveryController.delete);

routes.get('/delivery/problems', DeliveryWithProblemController.index);
routes.delete('/problems/:id/cancel-delivery', DeliveryProblemController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
