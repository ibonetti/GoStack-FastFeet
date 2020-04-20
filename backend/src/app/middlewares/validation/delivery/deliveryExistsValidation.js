import Delivey from '../../../models/Delivery';

export default async (req, res, next) => {
  const delivery = await Delivey.findByPk(req.params.id);

  if (!delivery) {
    return res.status(400).json({ error: 'Delivery not found!' });
  }

  return next();
}
