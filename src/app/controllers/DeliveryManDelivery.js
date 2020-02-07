import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import { Op } from 'sequelize';

class DeliveryManDelivery{
  async index(req, res){
    const { id, status } = req.params;
    let where = {};
    if (status === 'open'){
      where = {
        deliveryman_id: id,
        end_date: null,
        canceled_at: null,
      }
    }else {
      where = {
        deliveryman_id: id,
        end_date:{
          [Op.gt] : 0,
        },
        canceled_at: null,
      }
    }
    const deliveries = await Delivery.findAll({
      where,
      attributes: ['product', 'start_date'],
      include: [
        {
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model:Recipient,
          as: 'recipient',
          attributes: ['name', 'city']
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res){
    const { id, deliveryId } = req.params;
    const { startDate, endDate} = req.body;

    return res.json({});
  }
}

export default new DeliveryManDelivery();
