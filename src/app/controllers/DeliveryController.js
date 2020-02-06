import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';
import * as Yup from 'yup';

class DeliveryManController{
  async index(req, res){
    //List deliveries that are still open and not canceled
    const deliveries = await Delivery.findAll({
      where : {
        end_date: null,
        canceled_at: null,
      },
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

  async store(req, res){
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails ' });
    }
    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async update(req, res){
    const delivery = await Delivery.findByPk(req.params.id);

    await delivery.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res){
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id);

    await delivery.destroy();

    return res.json({});
  }
}

export default new DeliveryManController();
