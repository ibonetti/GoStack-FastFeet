import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import { Op } from 'sequelize';

class DeliveryWithProblemController{
  async index(req, res){

    const deliveriesWithProblems = await DeliveryProblem.findAll({
      attributes: ['delivery_id', 'description'],
      include: [{
        model: Delivery,
        as: 'delivery',
        attributes: ['product'],
        where: {
          canceled_at: null,
          end_date:{
            [Op.gt] : 0,
          }
        },
        include: [{
          model: DeliveryMan,
          as: 'deliveryman',
          attributes: ['name', 'email']
        },
        {
          model: Recipient,
          as:  'recipient',
          attributes: ['name', 'street', 'number', 'city']
        },
        ],
       },
      ],
    });

    return res.json(deliveriesWithProblems);
  }
}

export default new DeliveryWithProblemController();
