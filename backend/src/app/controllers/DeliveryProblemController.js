/**Todas as entregas com problema
Todos os problemas de uma encomenda
Cadastrar problema para encomenda com id do entregador
Cancelar encomenda pelo id do problema*/
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import DeliveryMan from '../models/DeliveryMan';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import DeliveryCancellationMail from '../jobs/DeliveryCancellationMail';

class DeliveryProblemController{
  async index(req, res){
    const { id } = req.params;

    const deliveryProblems = await DeliveryProblem.findAll(
      {
        attributes: ['delivery_id', 'description'],
        where:{
          delivery_id: id,
        }
      });

    return res.json(deliveryProblems);
  }

  async store(req,res){
    const { id } = req.params;
    const { description } = req.body;

    const problem = {
      delivery_id: id,
      description,
    };

    const deliveryProblem = await DeliveryProblem.create(problem);

    return res.json(deliveryProblem);
  }

  async delete(req,res){
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id);
    if (!DeliveryProblem){
      return res.status(400).json({ error: 'Problem not found! '});
    }
    const delivery = await Delivery.findByPk(deliveryProblem.delivery_id);
    delivery.canceled_at = new Date();
    delivery.save();

    const deliveryDet = await Delivery.findByPk(deliveryProblem.delivery_id, {
      attributes: ['product', 'start_date', 'id'],
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

    Queue.add(DeliveryCancellationMail.key,{
      deliveryDet,
      deliveryProblem,
    });

    return res.json({});
  }
}

export default new DeliveryProblemController();
