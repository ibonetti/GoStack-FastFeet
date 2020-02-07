import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import {parseISO, isBefore, isAfter, setHours, startOfHour} from 'date-fns';

class PickUpDelivery{
  async store(req, res){
    const { id, deliveryid } = req.params;
    const { startDate } = req.body;

    const delivery = await Delivery.findByPk(deliveryid);

    if (!delivery){
      return res.status(400).json({ error: "Delivery not found!"});
    }

    if (delivery.deliveryman_id != id){
      return res.status(401).json({ error: "This delivery doesn't belong to you!"});
    }

    const date = parseISO(startDate);
    const initialLimit = startOfHour(setHours(date, 8));
    const finalLimit = startOfHour(setHours(date, 18));
    if (isBefore(date, initialLimit) || isAfter(date, finalLimit)){
      return res.status(401).json({ error: "Deliveries must be pickedUp between 08:00 and 18:00! "})
    }

    return res.json({});
  }
}

export default new PickUpDelivery();
