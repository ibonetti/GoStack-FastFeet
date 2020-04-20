import DeliveryMan from '../../../models/DeliveryMan';

export default async (req, res, next) => {
  const deliveryMan = await DeliveryMan.findByPk(req.params.id);

  if (!deliveryMan) {
    return res.status(401).json({ error: 'DeliveryMan not found' });
  }

  if (deliveryMan.inactive){
    return res.status(400).json({ error: 'DeliveryMan is inactive'});
  }

  return next();
}
