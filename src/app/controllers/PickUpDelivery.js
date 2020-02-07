import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import {parseISO, isBefore, isAfter, setHours, startOfHour, startOfDay, endOfDay} from 'date-fns';
import { Op } from 'sequelize';

class PickUpDelivery{
  async store(req, res){
    const { id, deliveryid } = req.params;
    const { startDate } = req.body;
    const date = parseISO(startDate);

    const deliveriesCount = await Delivery.count({
      where:{
        deliveryman_id: id,
        canceled_at: null,
        start_date:{
          [Op.between]: [startOfDay(date), endOfDay(date)],
        }
      }
    });

    if (deliveriesCount >= 5){
      return res.status(400).json({ error: "You have already picked up 5 deliveries today. Try tomorrow"});
    }

    const delivery = await Delivery.findByPk(deliveryid);

    if (!delivery){
      return res.status(400).json({ error: "Delivery not found!"});
    }

    if (delivery.start_date > 0){
      return res.status(401).json({ error: "Delivery has already been taken!"});
    }

    if (delivery.deliveryman_id != id){
      return res.status(401).json({ error: "This delivery doesn't belong to you!"});
    }

    const initialLimit = startOfHour(setHours(date, 8));
    const finalLimit = startOfHour(setHours(date, 18));
    if (isBefore(date, initialLimit) || isAfter(date, finalLimit)){
      return res.status(401).json({ error: "Deliveries must be pickedUp between 08:00 and 18:00! "})
    }

    delivery.start_date = date;
    delivery.save();

    return res.json({delivery});
  }
}

export default new PickUpDelivery();
