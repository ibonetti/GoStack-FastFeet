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
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    await deliveryMan.update(req.body);
    const { name, email, avatar_id } = deliveryMan;


    return res.json({name, email, avatar_id});
  }

  async delete(req, res){
    const { id } = req.params;
    const deliveryMan = await DeliveryMan.findByPk(id);

    deliveryMan.inactive = true;
    deliveryMan.save();

    return res.json(deliveryMan);
  }
}

export default new DeliveryManController();
