import DeliveryMan from '../models/DeliveryMan';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Mail from '../../lib/Mail';

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
    const delivery = await Delivery.create(req.body);
    const deliveryDet = await Delivery.findByPk(delivery.id, {
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
          attributes: ['name', 'city', 'street', 'number', 'state', 'city']
        },
      ],
    });

    await Mail.sendMail({
      to: `${deliveryDet.deliveryman.name} <${deliveryDet.deliveryman.email}>`,
      subject: 'New Delivery waiting for you',
      template: 'newdelivery',
      context: {
        deliveryman: deliveryDet.deliveryman.name,
        product: deliveryDet.product,
        recipient: deliveryDet.recipient.name,
        address: `${deliveryDet.recipient.street}, ${deliveryDet.recipient.number}
                    - ${deliveryDet.recipient.city}/${deliveryDet.recipient.state}`,
      },
    });

    return res.json(deliveryDet);
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
